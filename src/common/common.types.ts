interface Metadata {
  color?: string;
  x?: string | number;
  y?: string | number;
  label?: string;
  file?: {
    url: string;
    md5: string;
    path: string;
  };
  icon?: string;
  fixed_position?: {
    [key: string]: {
      color: string;
      icon: string;
      value: string;
      x: string;
      y: string;
    };
  };
  sentValues?: [{ label: string; value: string | number | boolean }];
  [key: string]: any;
}

interface Data {
  id?: string;
  variable: string;
  value?: string | number | boolean | void;
  location?: { lat: number; lng: number };
  metadata?: Metadata;
  serie?: string;
  unit?: string;
  origin: string;
  time: Date;
  created_at?: Date;
}

interface TagsObj {
  key: string;
  value: string;
}

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};
interface Query<T, U> {
  /**
   * Page of list starting from 1
   */
  page?: number;
  /**
   * Amount of items will return.
   */
  amount?: number;
  /**
   *  Array of field names.
   */
  fields?: (keyof T)[];
  /**
   *  Filter object.
   */
  filter?: RecursivePartial<T>;
  /**
   * Tuple with a field and an order
   */
  orderBy?: [Extract<keyof T, U>, "asc" | "desc"];
}

/**
 * ID used on TagoIO, string with 24 character
 */
type GenericID = string;

/**
 * Token used on TagoIO, string with 36 characters
 */
type GenericToken = string;

type Base64 = string;

type PermissionOption = "write" | "read" | "full" | "deny";

type ExpireTimeOption = "never" | Date;

type ExportOption = "csv" | "json" | "xml";

type Conditionals = "<" | ">" | "=" | "!" | "><" | "*";

type RunTypeOptions = "node" | "python";

type TokenCreateResponse = { token: GenericToken; expire_date: ExpireTimeOption; permission: PermissionOption };

type RefType = "dashboard";

interface TokenDataList {
  token: GenericToken;
  name: string;
  type: string;
  permission: PermissionOption;
  serie_number: string | null;
  last_authorization: Date | null;
  verification_code: string | null;
  expire_time: ExpireTimeOption;
  ref_id: string;
  created_at: Date;
  created_by: string | null;
}

interface TokenData {
  /**
   * A name for the token.
   */
  name: string;
  /**
   * The time for when the token should expire.
   * It will be randomly generated if not included.
   * Accepts “never” as value.
   */
  expire_time?: ExpireTimeOption;
  /**
   * Token permission should be 'write', 'read' or 'full'.
   */
  permission: PermissionOption;
  /**
   * [optional] The serial number of the device.
   */
  serie_number?: string;
  /**
   * [optional] Verification code to validate middleware requests.
   */
  verification_code?: string;
  /**
   * [optional] Middleware or type of the device that will be added.
   */
  middleware?: string;
}

interface ListTokenQuery
  extends Query<TokenDataList, "name" | "permission" | "serie_number" | "verification_code" | "created_at"> {}

export {
  Data,
  TagsObj,
  Query,
  Base64,
  GenericID,
  GenericToken,
  PermissionOption,
  ExpireTimeOption,
  ExportOption,
  Conditionals,
  TokenCreateResponse,
  RunTypeOptions,
  RefType,
  ListTokenQuery,
  TokenData,
  TokenDataList,
  RecursivePartial,
};
