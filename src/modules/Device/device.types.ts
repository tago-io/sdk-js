import { Data, GenericID, GenericToken, TagsObj } from "../../common/common.types";
import { Regions } from "../../regions";

interface DeviceInfo {
  id: GenericID;
  profile: string;
  bucket: {
    id: GenericID;
    name: string;
  };
  name: string;
  description: string | void;
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
}

/**
 * @param token token
 */
interface DeviceConstructorParams {
  token: GenericToken;
  region?: Regions;
  // options?: any;
}

type DataToSend = Omit<Data, "id" | "created_at" | "origin" | "time"> & { time?: Date | string };

type valuesTypes = string | number | boolean | void;

interface DataQueryBase {
  /**
   * Filter by variables
   * It can ben a array of string or only one string
   */
  variables?: string[] | string;
  /**
   * Filter by origins
   * It can ben a array of string or only one string
   */
  origins?: string[] | string;
  /**
   * Filter by series
   * It can ben a array of string or only one string
   */
  series?: string[] | string;
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
  /**
   * Set the start date of query
   */
  start_date?: Date | string;
  /**
   * Set the end date of query
   * @default
   * Date.now()
   */
  end_date?: Date | string;
}

type DataQueryDefault = DataQueryBase & {
  query?: "default";
  /**
   * Qty of records to retrieve
   */
  qty?: number;
  /**
   * Add internal details in each record
   */
  details?: boolean;
  /**
   * Change ordination of query
   * @default "descending"
   */
  ordination?: "descending" | "ascending";
  /**
   * Skip records, used on pagination or pooling
   */
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
    | "first_insert";
};

type DataQueryAggregation = Omit<DataQueryBase, "start_date"> & {
  query: "avg" | "sum";
  start_date: Date | string;
};

type DataQuerySummary = DataQueryBase & {
  query: "min" | "max" | "count";
};

type DataQuery = DataQueryDefault | DataQueryFirstLast | DataQuerySummary | DataQueryAggregation;

type DataQueryStreaming = Omit<DataQueryDefault, "qty" | "skip" | "query" | "ordination">;

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
}

type ListResponse = DeviceInfo[];

export {
  DeviceConstructorParams,
  DeviceInfo,
  DataToSend,
  DataQuery,
  DataQueryStreaming,
  OptionsStreaming,
  ListResponse,
  valuesTypes,
};
