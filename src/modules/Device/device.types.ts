import { Data, DataCreate, DataEdit, GenericID, GenericToken, TagsObj } from "../../common/common.types";
import { Regions } from "../../regions";
import { DeviceInfo } from "../Account/devices.types";

/**
 * @param token token
 */
interface DeviceConstructorParams {
  token: GenericToken;
  region?: Regions;
  // options?: any;
}

type DataToSend = DataCreate;
type DataToEdit = DataEdit;

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
  DataToSend,
  DataToEdit,
  DataQuery,
  DataQueryStreaming,
  OptionsStreaming,
  ListResponse,
  valuesTypes,
};
