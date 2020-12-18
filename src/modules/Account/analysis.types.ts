import { Base64, RunTypeOptions, GenericID, TagsObj, Query, ExpireTimeOption } from "../../common/common.types";

interface ScriptFile {
  name: string;
  content: Base64;
  language: RunTypeOptions;
}

interface AnalysisCreateInfo {
  name: string;
  description?: string | null;
  interval?: string;
  run_on?: "tago" | "external";
  file_name?: string;
  runtime?: RunTypeOptions;
  active?: true;
  profile?: GenericID;
  variables?: {
    key: string;
    value: string | number | boolean;
  };
  tags?: TagsObj[];
}

interface AnalysisInfo extends AnalysisCreateInfo {
  id: GenericID;
  token: string;
  last_run: ExpireTimeOption;
  created_at: Date;
  updated_at: Date;
  locked_at: any;
  console?: string[];
}

type AnalysisQuery = Query<AnalysisInfo, "name" | "active" | "run_on" | "last_run" | "created_at" | "updated_at">;

export { AnalysisInfo, AnalysisCreateInfo, ScriptFile, AnalysisQuery };
