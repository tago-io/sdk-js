import type { Base64, ExpireTimeOption, GenericID, Query, RunTypeOptions, TagsObj } from "../../common/common.types.ts";

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
type AnalysisListItem<
  T extends AnalysisQuery["fields"] extends readonly (keyof any)[]
    ? AnalysisQuery["fields"][number]
    : keyof AnalysisInfo = keyof AnalysisInfo,
> = Pick<AnalysisInfo, T> & Partial<AnalysisInfo>;

/**
 * Available runtime environments for snippets
 */
type SnippetRuntime = "node-legacy" | "python-legacy" | "python-2025-08-01" | "deno-2025-08-01";

/**
 * Individual snippet metadata
 */
interface SnippetItem {
  /** Unique identifier for the snippet */
  id: string;
  /** Human-readable title */
  title: string;
  /** Description of what the snippet does */
  description: string;
  /** Programming language (typescript, javascript, python) */
  language: string;
  /** Array of tags for categorization */
  tags: string[];
  /** Filename of the snippet */
  filename: string;
  /** Full path to the file in the runtime directory */
  file_path: string;
}

/**
 * API response containing all snippets metadata for a runtime
 */
interface SnippetsListResponse {
  /** Runtime environment identifier */
  runtime: SnippetRuntime;
  /** Schema version for the API response format */
  schema_version: number;
  /** ISO timestamp when the response was generated */
  generated_at: string;
  /** Array of all available snippets for this runtime */
  snippets: SnippetItem[];
}

export type {
  AnalysisInfo,
  AnalysisCreateInfo,
  ScriptFile,
  AnalysisQuery,
  AnalysisListItem,
  SnippetRuntime,
  SnippetItem,
  SnippetsListResponse,
};
