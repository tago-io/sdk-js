import TagoIOModule from "../../common/TagoIOModule";
import ConsoleService from "../Services/Console";
import apiSocket, { channels } from "../../infrastructure/apiSocket";
import { AnalysisConstructorParams, analysisFunction, AnalysisEnvironment } from "./analysis.types";

/**
 * This class is used to instance an analysis
 *
 * It's can run locally or on TagoIO.
 */
class Analysis extends TagoIOModule<AnalysisConstructorParams> {
  private analysis: analysisFunction;

  constructor(analysis: analysisFunction, params?: AnalysisConstructorParams) {
    super(params || { token: "unknown" });
    this.analysis = analysis;

    if (!process.env.TAGO_RUNTIME) {
      this.localRuntime();
    }
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
  public run(environment: AnalysisEnvironment, data: any[], analysis_id: string, token: string) {
    const tagoConsole = new ConsoleService({ token, region: this.params.region });

    const log = (...args: any[]) => {
      if (!process.env.TAGO_RUNTIME) {
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

    if (!this.analysis || typeof this.analysis !== "function") {
      throw "Invalid analysis function";
    }

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

  private localRuntime() {
    if (this.params.token === "unknown") {
      throw "To run analysis locally, you needs a token";
    }

    const socket = apiSocket(this.params);

    socket.on("connect", () => console.info("Connected to TagoIO, Getting analysis information..."));

    socket.on("disconnect", () => console.info("Disconnected from TagoIO.\n\n"));

    socket.on("error", (e: Error) => console.error("Connection error", e));

    socket.on("ready", (analysis: any) => console.info(`Analysis [${analysis.name}] Started.`));

    socket.on(channels.analysisTrigger, (scope: any) => {
      this.run(scope.environment, scope.data, scope.analysis_id, scope.token);
    });
  }
}

export default Analysis;
