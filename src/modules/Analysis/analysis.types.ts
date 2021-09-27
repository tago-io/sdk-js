import { Regions } from "../../regions";

type analysisFunction = (context: any, data: any) => any;

interface AnalysisConstructorParams {
  token?: string;
  region?: Regions;
  // options?: any;
  /**
   * Auto Start analysis after instance the class
   * If turn it off, you can start analysis calling [AnalysisInstance].start();
   * [Default: true]
   */
  autostart?: boolean;
  /**
   * Load TagoIO Analysis envs on process.env.
   *
   * Warning: It's not safe to use on external analysis
   * It will load all env on process, then if the external analysis receive multiples requests
   * simultaneous, it can mass up.
   *
   * [Default: false]
   */
  loadEnvOnProcess?: boolean;
}

interface AnalysisEnvironment {
  [key: string]: string;
}

export { AnalysisConstructorParams, analysisFunction, AnalysisEnvironment };
