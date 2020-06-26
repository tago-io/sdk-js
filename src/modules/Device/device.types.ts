import { Regions } from "../../regions";
import { Data } from "../../comum/comum.types";

interface DeviceInfo {
  name: string;
}

interface DeviceConstructorParams {
  token: string;
  region: Regions;
  // options?: any;
}

type DataToSend = Omit<Data, "id" | "created_at" | "origin">;

interface DataQuery {
  query?: "default" | "last_item" | "last_value" | "last_location" | "last_insert" | "min" | "max" | "count";
  qty?: number;
  details?: boolean;
  variables?: string[];
  origins?: string[];
  series?: string[];
  ids?: string[];
  values?: (string | number | boolean)[];
  start_date?: Date | string;
  end_date?: Date | string;
}

export { DeviceConstructorParams, DeviceInfo, DataToSend, DataQuery };
