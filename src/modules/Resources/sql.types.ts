import type { GenericID, Query, TagsObj } from "../../common/common.types.ts";

/** Positional parameter as `{ key: "$n", value: "..." }`. */
interface SQLParam {
  key: string;
  value: string;
}

interface SQLCreateInfo {
  /** Required, 1..=64 chars. */
  name: string;
  /** Optional, up to 1024 chars. */
  description?: string;
  /** The TagoSQL query. Parsed and validated against your plan at save time. */
  query: string;
  /** Positional defaults; must cover exactly the placeholders the query uses ($1..$N). */
  params?: SQLParam[];
  /** Enables the result cache on execute. Default false. */
  cache_enabled?: boolean;
  /** Clamped to 0..=86400 (24h). A TTL of 0 disables caching. */
  cache_ttl_seconds?: number;
  /** Per-query soft rate cap; rejected at save time if above the plan's hard cap. */
  rate_limit_rpm?: number | null;
  /** An inactive query cannot be executed. Default true. */
  active?: boolean;
  tags?: TagsObj[];
}

interface SQLInfo extends SQLCreateInfo {
  id: GenericID;
  version: number;
  created_at: Date;
  updated_at: Date;
  /** Read-only, derived server-side: true when the query text uses session functions. Never accepted as input. */
  session_context: boolean;
}

type SQLQuery = Query<SQLInfo, "name" | "active" | "created_at" | "updated_at">;

interface SQLExecuteObj {
  /** Values merged over the saved defaults per key. */
  params?: SQLParam[];
  /** Probe mode: skips the result cache entirely (no read, no write). */
  test?: boolean;
  /** Fleet pagination cursor: the last device id of the previous page. */
  after_device?: GenericID;
}

interface SQLColumn {
  name: string;
  type: "string" | "number" | "timestamp" | "boolean" | "json";
}

interface SQLExecuteResult {
  /** Ordered column list with client-facing types. */
  columns: SQLColumn[];
  /** One object per row, keyed by column name. */
  rows: Record<string, unknown>[];
  row_count: number;
  /** Server-side execution time in milliseconds. */
  execution_ms: number;
  /** True when the result came from the cache. */
  served_from_cache: boolean;
}

interface SQLVersionInfo {
  query: string;
  params: SQLParam[];
  created_at: Date | null;
}

interface SQLTableInfo {
  function: string;
  label: string;
  tag_form?: string;
  columns: SQLColumn[];
  /** True for entity data when no entity_id was supplied to resolve columns. */
  dynamic?: boolean;
}

interface SQLResourceItem {
  id: GenericID;
  name: string;
}

interface SQLFunctionInfo {
  name: string;
  kind: "aggregate" | "session";
  args: string[];
  description: string;
  /** Present only on session functions; carries the COALESCE authoring idiom. */
  example?: string;
}

interface SQLTablesResult {
  tables: SQLTableInfo[];
  resources: {
    devices: SQLResourceItem[];
    entities: SQLResourceItem[];
  };
  /** Everything callable in a query, built from the allowlists. */
  functions: SQLFunctionInfo[];
}

interface SQLTablesQuery {
  /** Substring match on device/entity name. */
  filter?: string;
  /** Default 20, clamped 1..=100. */
  amount?: number;
  /** 1-based. */
  page?: number;
  /** Resolve the columns of one entity you own. */
  entity_id?: GenericID;
}

export type {
  SQLColumn,
  SQLCreateInfo,
  SQLExecuteObj,
  SQLExecuteResult,
  SQLFunctionInfo,
  SQLInfo,
  SQLParam,
  SQLQuery,
  SQLResourceItem,
  SQLTableInfo,
  SQLTablesQuery,
  SQLTablesResult,
  SQLVersionInfo,
};
