import { Regions } from "../../regions";

type analysisFunction = (context: any, data: any) => any;

interface AnalysisConstructorParams {
  token?: string;
  region?: Regions;
  // options?: any;
}

interface AnalysisEnvironment {
  [key: string]: string;
}

export { AnalysisConstructorParams, analysisFunction, AnalysisEnvironment };
