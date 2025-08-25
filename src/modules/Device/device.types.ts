import type { Data, DataCreate, DataEdit, GenericID, GenericToken, TagsObj } from "../../common/common.types.ts";
import type { Regions, RegionsObj } from "../../regions.ts";

interface DeviceItem {
  id: GenericID;
  profile: string;
  bucket: {
    id: GenericID;
    name: string;
  };
  name: string;
  description: string | undefined;
  visible: boolean;
  active: boolean;
  last_output: Date | null;
  last_input: Date | null;
  connector: string;
  network: string;
  connector_parse: boolean;
  parse_function: string;
  tags: TagsObj[];
  updated_at: Date;
  created_at: Date;
  inspected_at: Date | null;
  bucket_name?: string;
  payload_decoder?: string;
}

/**
 * @param token token
 */
interface DeviceConstructorParams {
  token: GenericToken;
  region?: Regions | RegionsObj;
  // options?: any;
}

type DataToSend = DataCreate;
type DataToEdit = DataEdit;

type valuesTypes = string | number | boolean | undefined;

interface DataQueryBase {
  /**
   * Filter by variables
   * It can ben a array of string or only one string
   */
  variables?: string[] | string;
  /**
   * Filter by origins
   * It can ben a array of string or only one string
   *
   * @deprecated Filtering by origins will be removed along with the Legacy buckets.
   */
  origins?: string[] | string;
  /**
   * Filter by series
   * It can ben a array of string or only one string
   *
   * @deprecated Deprecating this in favor of `groups`.
   */
  series?: string[] | string;
  /**
   * Filter by groups.
   *
   * It can ben a array of strings or only one string, each string being a `group`.
   */
  groups?: string[] | string;
  /**
   * Filter by ids
   * It can ben a array of string or only one string
   */
  ids?: string[] | string;
  /**
   * Filter by values
   * It can ben a array or only one element
   */
  values?: valuesTypes[] | valuesTypes;
  /** Set the start date of query */
  start_date?: Date | string;
  /**
   * Set the end date of query
   * @default
   * Date.now()
   */
  end_date?: Date | string;
  /** Add internal details in each record */
  details?: boolean;
}

type DataQueryDefault = DataQueryBase & {
  query?: "default";
  /** Qty of records to retrieve */
  qty?: number;
  /**
   * Change ordination of query
   * @default "descending"
   */
  ordination?: "descending" | "ascending";
  /** Skip records, used on pagination or pooling */
  skip?: number;
};

type DataQueryFirstLast = DataQueryBase & {
  query:
    | "last_item"
    | "last_value"
    | "last_location"
    | "last_insert"
    | "first_item"
    | "first_value"
    | "first_location"
    | "first_insert"
    | "aggregate"
    | "conditional";
};

type DataQueryAvgSum = Omit<DataQueryBase, "start_date"> & {
  query: "avg" | "sum";
  start_date: Date | string;
};

type DataQuerySummary = DataQueryBase & {
  query: "min" | "max" | "count";
};

type DataQueryAggregate = DataQueryBase & {
  query: "aggregate";
  interval: "minute" | "hour" | "day" | "month" | "quarter" | "year";
  function: "avg" | "sum" | "min" | "max";
};

type DataQueryConditional = Omit<DataQueryBase, "start_date"> & {
  query: "conditional";
  start_date: Date | string;
  value: number;
  function: "gt" | "gte" | "lt" | "lte" | "eq" | "ne";
};

type DataQuery =
  | DataQueryDefault
  | DataQueryFirstLast
  | DataQuerySummary
  | DataQueryAvgSum
  | DataQueryAggregate
  | DataQueryConditional;

type DataQueryStreaming = Omit<DataQueryDefault, "qty" | "skip" | "query">;

interface OptionsStreaming {
  /**
   * Qty of records by pooling
   * @default 1000
   */
  poolingRecordQty?: number;
  /**
   * Time (milliseconds) between each request
   * @default 1000 = (1 second)
   */
  poolingTime?: number;
  /**
   * Never Stop pooling data
   * The streaming will not stop after get all data
   * @default false
   */
  neverStop?: boolean;
  /**
   * start skip from a specific record
   * @default 0
   */
  initialSkip?: number;
}

type ListResponse = DeviceItem[];

type DataQueryNumberResponse = Pick<Data, "time"> & { value: number };

export type {
  DeviceConstructorParams,
  DeviceItem,
  DataToSend,
  DataToEdit,
  DataQuery,
  DataQuerySummary,
  DataQueryStreaming,
  DataQueryAggregate,
  DataQueryFirstLast,
  DataQueryDefault,
  DataQueryNumberResponse,
  OptionsStreaming,
  ListResponse,
  valuesTypes,
};
