import { Data, GenericID, GenericToken, TagsObj } from "../../common/common.types";
import { Regions } from "../../regions";

interface DeviceInfo {
  id: GenericID;
  profile: string;
  bucket: string;
  name: string;
  description: string | void;
  visible: boolean;
  active: boolean;
  last_output: string;
  last_input: string;
  connector: string;
  connector_parse: boolean;
  parse_function: string;
  tags: TagsObj[];
  updated_at: string;
  created_at: string;
  inspected_at: string;
  bucket_name?: string;
}

interface DeviceConstructorParams {
  token: GenericToken;
  region?: Regions;
  // options?: any;
}

type DataToSend = Omit<Data, "id" | "created_at" | "origin" | "time"> & { time?: Date };

type valuesTypes = string | number | boolean | void;

interface DataQuery {
  query?: "default" | "last_item" | "last_value" | "last_location" | "last_insert" | "min" | "max" | "count";
  qty?: number;
  details?: boolean;

  // Plural
  variables?: string[] | string;
  origins?: string[] | string;
  series?: string[] | string;
  ids?: string[] | string;
  values?: valuesTypes[] | valuesTypes;
  // Singular
  variable?: string[] | string;
  origin?: string[] | string;
  serie?: string[] | string;
  id?: string[] | string;
  value?: valuesTypes[] | valuesTypes;

  start_date?: Date | string;
  end_date?: Date | string;
}

type ListResponse = DeviceInfo[];

export { DeviceConstructorParams, DeviceInfo, DataToSend, DataQuery, ListResponse, valuesTypes };
