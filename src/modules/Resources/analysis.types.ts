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

/**
 * Session events that also run the code of an Analysis with the MQTT Endpoint on. A PUBLISH always runs it;
 * CONNECT, SUBSCRIBE, and UNSUBSCRIBE are opt-in: each runs it only when turned on here. All off by default.
 */
interface AnalysisMqttEvents {
  connect: boolean;
  subscribe: boolean;
  unsubscribe: boolean;
}

/** Broker ports of the MQTT Endpoint. */
interface AnalysisMqttPorts {
  /** MQTT over TCP, e.g. `1883`. */
  plain: number;
  /** MQTT over TLS, e.g. `8883`. */
  secure: number;
}

/**
 * MQTT Endpoint of a saved Luau Analysis: devices connect with a Service Authorization bound to the Analysis
 * (`analysis` on `serviceAuthorization.tokenCreate`), and each message they publish runs its code.
 * Off by default; turning it or an event on is accepted only on a Luau (Sandbox) runtime.
 *
 * The MQTT Endpoint is for paid plans (Lite, Pro, and Max; TagoDeploy instances always have it). On a Free account,
 * turning it or an event on, creating a bound authorization, and Try it are refused with
 * `"The MQTT Endpoint needs a paid plan. Upgrade to use it."`. Turning things off is always allowed.
 */
interface AnalysisMqtt {
  /** Whether published messages run the Analysis. */
  active: boolean;
  /** Session events that also run the code. */
  events: AnalysisMqttEvents;
  /** Broker host devices connect to. Read-only; present only when the TagoIO instance sets one. */
  host?: string;
  /** Broker ports. Read-only; present with `host`. */
  ports?: AnalysisMqttPorts;
}

/** MQTT Endpoint settings sent on create or edit. Omitted fields keep their stored value (on create, off). */
interface AnalysisMqttChanges {
  active?: boolean;
  events?: Partial<AnalysisMqttEvents>;
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
  /** MQTT Endpoint settings. Omitted fields keep their default (off). */
  mqtt?: AnalysisMqttChanges;
}

/**
 * Fields accepted when editing an analysis. `endpoint` and `mqtt` are partial updates merged into the stored ones;
 * `mqtt.host` and `mqtt.ports` are read-only.
 */
type AnalysisEditInfo = Partial<Omit<AnalysisInfo, "endpoint" | "mqtt">> & {
  endpoint?: Partial<AnalysisEndpoint>;
  mqtt?: AnalysisMqttChanges;
};

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
  /**
   * MQTT Endpoint state. Returned by `info`, not by `list`, and missing on servers without the MQTT Endpoint
   * (such as older TagoDeploy instances).
   */
  mqtt?: AnalysisMqtt;
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
  /** Endpoint root without a trailing slash, `{API_URL}/endpoint/{id}`; request paths start with `/`. */
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

/** A test message for the MQTT Endpoint of an Analysis. */
interface AnalysisMqttTry {
  /** Topic name as a device would publish it, without `+`, `#`, or NUL. */
  topic: string;
  /** Payload, given to the code as UTF-8 bytes. */
  payload: string;
  /** @default 1 */
  qos?: 0 | 1 | 2;
}

/**
 * How a test message ended: `"ran"` (the code ran to its end), `"failed"` (the code raised, hit a limit or the deadline,
 * or could not start), `"refused"` (the Analysis is deactivated, not Luau, or has the MQTT Endpoint off, or the account
 * is on the Free plan), `"rate_limited"` (the profile's MQTT Endpoint runs per minute are spent), or `"too_large"` (the
 * payload is over 256 KiB). Details go to the Analysis console.
 */
type AnalysisMqttOutcome = "ran" | "failed" | "refused" | "rate_limited" | "too_large";

interface AnalysisMqttTryResult {
  outcome: AnalysisMqttOutcome;
  /** Time the run took, including the wait for it to start, in milliseconds. */
  duration_ms: number;
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
  AnalysisMqtt,
  AnalysisMqttChanges,
  AnalysisMqttEvents,
  AnalysisMqttOutcome,
  AnalysisMqttPorts,
  AnalysisMqttTry,
  AnalysisMqttTryResult,
  ScriptFile,
  AnalysisQuery,
  AnalysisListItem,
  SnippetRuntime,
  SnippetItem,
  SnippetsListResponse,
};
