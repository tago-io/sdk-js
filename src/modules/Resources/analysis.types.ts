import type { Base64, ExpireTimeOption, GenericID, Query, RunTypeOptions, TagsObj } from "../../common/common.types";

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
  /** Environment variables */
  variables?: {
    key: string;
    value: string | number | boolean;
  };
  tags?: TagsObj[];
}

interface VersionsAnalysis {
  [version_number_key: string]: {
    file_name: string;
    created_at: Date | string;
    /** E.g John Doe (john.doe@email.com)  */
    created_by: string;
  };
}

interface AnalysisInfo extends AnalysisCreateInfo {
  id: GenericID;
  token: string;
  last_run: ExpireTimeOption;
  created_at: Date;
  updated_at: Date;
  locked_at: any;
  console?: string[];
  /** Current version being used */
  version?: number | string;
  versions?: VersionsAnalysis;
}

type AnalysisQuery = Query<AnalysisInfo, "name" | "active" | "run_on" | "last_run" | "created_at" | "updated_at">;
type AnalysisListItem<T extends AnalysisQuery["fields"][number] = null> = Pick<AnalysisInfo, T> & Partial<AnalysisInfo>;

export type { AnalysisInfo, AnalysisCreateInfo, ScriptFile, AnalysisQuery, AnalysisListItem };
