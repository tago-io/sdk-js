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

type AnalysisToken = string;
type AnalysisID = string;
/**
 * As current version of the SDK doesn't provide the TagoContext interface.
 */
interface TagoContext {
  token: AnalysisToken;
  analysis_id: AnalysisID;
  environment: AnalysisEnvironment[];
  log: (...args: any[]) => void;
}

export { AnalysisConstructorParams, analysisFunction, AnalysisEnvironment, TagoContext };
