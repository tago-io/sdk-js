import type { Base64, ExpireTimeOption, GenericID, Query, RunTypeOptions, TagsObj } from "../../common/common.types.ts";

interface ScriptFile {
  name: string;
  content: Base64;
  language: RunTypeOptions;
}

/**
 * HTTP Endpoint of a saved Luau Analysis, answered at `{API_URL}/endpoint/{id}/{path}`.
 * Off by default; `active: true` is accepted only on a Luau (Sandbox) runtime.
 */
interface AnalysisEndpoint {
  /** Whether the Analysis answers HTTP requests at its Endpoint address. */
  active: boolean;
  /**
   * Who may call: `"token"` (default) needs a TagoIO token of the profile, `"public"` also accepts requests with no token.
   * Run user and analysis tokens always need the Access Management action `call_endpoint` on the analysis.
   */
  access: "public" | "token";
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
  /** Endpoint settings. Omitted fields keep their default (`active: false`, `access: "token"`). */
  endpoint?: Partial<AnalysisEndpoint>;
}

/** Fields accepted when editing an analysis. `endpoint` is a partial update merged into the stored one. */
type AnalysisEditInfo = Partial<Omit<AnalysisInfo, "endpoint">> & { endpoint?: Partial<AnalysisEndpoint> };

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
  endpoint: AnalysisEndpoint;
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

/** An analysis with an active Endpoint that the caller may call. */
interface AnalysisEndpointListItem {
  id: GenericID;
  name: string;
  /** Endpoint root, `{API_URL}/endpoint/{id}/`. */
  url: string;
}

/** Methods an Endpoint call may use. */
type AnalysisEndpointMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

type AnalysisEndpointQueryValue = string | number | boolean;

interface AnalysisEndpointCallOptions {
  /** @default "GET" */
  method?: AnalysisEndpointMethod;
  /** Path relative to the Endpoint root, e.g. `"/hello"`. Segments are URL-encoded; `.` and `..` are refused. @default "/" */
  path?: string;
  /** Query string values; an array repeats the key. */
  query?: Record<string, AnalysisEndpointQueryValue | AnalysisEndpointQueryValue[]>;
  /** Extra request headers. */
  headers?: Record<string, string>;
  /** A string is sent as is; any other value is sent as JSON. Not allowed with `GET` and `HEAD`. */
  body?: unknown;
}

interface AnalysisEndpointResponse<T = any> {
  status: number;
  /** Response headers with lowercased names. */
  headers: Record<string, string>;
  /** Parsed when the response is JSON, otherwise the response text. */
  body: T;
}

/**
 * Available runtime environments for snippets
 */
type SnippetRuntime = "node-legacy" | "python-legacy" | "node-rt2025" | "python-rt2025" | "deno-rt2025";

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
  AnalysisEditInfo,
  AnalysisEndpoint,
  AnalysisEndpointListItem,
  AnalysisEndpointMethod,
  AnalysisEndpointQueryValue,
  AnalysisEndpointCallOptions,
  AnalysisEndpointResponse,
  ScriptFile,
  AnalysisQuery,
  AnalysisListItem,
  SnippetRuntime,
  SnippetItem,
  SnippetsListResponse,
};
