interface Metadata {
  [key: string]: string | number | boolean | Metadata;
}

interface Data {
  id?: string;
  variable: string;
  value?: string | number | boolean | void;
  location?: { lat: number; lng: number };
  metadata?: Metadata;
  origin: string;
  time: Date;
  created_at: Date;
}

interface TagsObj {
  [key: string]: string;
}

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
  filter?: Partial<T>;
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

type permissionOption = "write" | "read" | "full";

type expireTimeOption = "never" | string;

export { Data, TagsObj, Query, GenericID, GenericToken, permissionOption, expireTimeOption };
