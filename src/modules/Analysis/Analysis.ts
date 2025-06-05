import { JSONParseSafe } from "../../common/JSONParseSafe";
import TagoIOModule from "../../common/TagoIOModule";
import { openSSEListening } from "../../infrastructure/apiSSE";
import getRegionObj, { setRuntimeRegion } from "../../regions";
import ConsoleService from "../Services/Console";
import type { AnalysisConstructorParams, AnalysisEnvironment, analysisFunction } from "./analysis.types";

/**
 * This class is used to instance an analysis
 *
 * It's can run locally or on TagoIO.
 */
class Analysis extends TagoIOModule<AnalysisConstructorParams> {
  private analysis: analysisFunction;
  public started = false;

  constructor(analysis: analysisFunction, params: AnalysisConstructorParams = { token: "unknown" }) {
    super(params);
    this.analysis = analysis;

    if (params.autostart !== false) {
      this.start();
    }
  }

  public start() {
    if (this.started) {
      return;
    }
    this.started = true;

    if (!process.env.T_ANALYSIS_CONTEXT) {
      this.localRuntime();
    } else {
      this.runOnTagoIO();
    }
  }

  private runOnTagoIO() {
    if (!this.analysis || typeof this.analysis !== "function") {
      throw "Invalid analysis function";
    }

    const context = {
      log: console.log,
      token: process.env.T_ANALYSIS_TOKEN,
      environment: JSONParseSafe(process.env.T_ANALYSIS_ENV, []),
      analysis_id: process.env.T_ANALYSIS_ID,
    };

    const data = JSONParseSafe(process.env.T_ANALYSIS_DATA, []);

    this.analysis(context, data);
  }

  private stringifyMsg(msg: any) {
    return typeof msg === "object" && !Array.isArray(msg) ? JSON.stringify(msg) : String(msg);
  }

  /**
   * Run Analysis
   * @internal
   * @param environment
   * @param data
   * @param analysis_id
   * @param token
   */
  private runLocal(environment: AnalysisEnvironment[], data: any[], analysis_id: string, token: string) {
    if (!this.analysis || typeof this.analysis !== "function") {
      throw "Invalid analysis function";
    }

    const tagoConsole = new ConsoleService({ token, region: this.params.region });

    const log = (...args: any[]) => {
      if (!process.env.T_ANALYSIS_AUTO_RUN) {
        console.log(...args);
      }

      if (args[0]?.stack) {
        args[0] = args[0].stack;
      }

      const argsStrings = Object.keys(args).map((x: any) => this.stringifyMsg(args[x]));

      tagoConsole.log(argsStrings.join(" ")).catch(console.error);
    };

    const context = {
      log,
      token,
      environment,
      analysis_id,
    };

    if (this.analysis.constructor.name === "AsyncFunction") {
      this.analysis(context, data || []).catch(log);
    } else {
      try {
        this.analysis(context, data || []);
      } catch (error) {
        log(error);
      }
    }
  }

  private async localRuntime() {
    if (this.params.token === "unknown") {
      throw "To run analysis locally, you needs a token";
    }

    const analysis = await this.doRequest<{ name: string; active: boolean; run_on: "external" | "tago" }>({
      path: "/info",
      method: "GET",
    }).catch((_): undefined => undefined);

    if (!analysis) {
      console.error("¬ Error :: Analysis not found or not active.");
      return;
    }

    if (analysis.run_on !== "external") {
      console.info("¬ Warning :: Analysis is not set to run on external");
    }

    const sse = await openSSEListening(
      { channel: "analysis_trigger" },
      { token: this.params.token, region: this.params.region }
    );

    setInterval(() => {
      if (sse.OPEN === sse.readyState) {
        sse.dispatchEvent(new Event("keep-alive"));
      }
    }, 15000); // 15 seconds

    const tokenEnd = this.params.token.slice(-5);

    sse.addEventListener("message", (event) => {
      const data = JSONParseSafe(event?.data, {})?.payload;

      if (!data) {
        // console.log("Invalid data", event.data);
        return;
      }

      this.runLocal(data.environment, data.data, data.analysis_id, data.token);
    });

    sse.addEventListener("error", (_err) => {
      // console.debug(_error);
      console.error("¬ Connection was closed, trying to reconnect...");
    });

    sse.addEventListener("open", () => {
      console.info(`\n¬ Connected to TagoIO :: Analysis [${analysis.name}](${tokenEnd}) is ready.`);
      console.info("¬ Waiting for analysis trigger...\n");
    });
  }

  public static use(analysis: analysisFunction, params?: AnalysisConstructorParams) {
    if (!process.env.T_ANALYSIS_TOKEN && params?.token) {
      process.env.T_ANALYSIS_TOKEN = params.token;
    }

    const runtimeRegion = params?.region ? getRegionObj(params.region) : null;
    if (runtimeRegion) {
      setRuntimeRegion(runtimeRegion);
    }

    return new Analysis(analysis, params);
  }
}

export default Analysis;
