import { Regions } from "../../regions";

type analysisFunction = (context: any, data: any) => any;

interface AnalysisConstructorParams {
  token?: string;
  region: Regions;
  // options?: any;
}

export { AnalysisConstructorParams, analysisFunction };
