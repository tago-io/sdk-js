import { ExpireTimeOption, GenericID, GenericToken, PermissionOption, Query, TagsObj } from "../../common/common.types";
import { DataStorageType } from "./buckets.types";


type EntityIndex = {
  fields: string[];
};


type EntityFieldType = "uuid" | "string" | "int" | "float" | "json" | "timestamp" | "text" | "boolean";

type EntityFieldInfo = {
  type: EntityFieldType;
  required?: boolean;
};


type EntityCreateInfo = {
  name: string;
  schema: Record<string, EntityFieldInfo>;
  index?: Record<string, EntityIndex>;
  tags?: TagsObj[];
  payload_decoder?: string | null;
};

type EntityInfo = Required<EntityCreateInfo> & {
  id: string;
  profile: string;
  created_at: string;
  updated_at: string;
};


interface EntityQuery
  extends Query<EntityInfo, "name" | "visible" | "active" | "last_input" | "created_at" | "updated_at"> {
  resolveBucketName?: boolean;
  resolveConnectorName?: boolean;
}


type EntityListItem<T extends EntityQuery["fields"][number] = "id"> = Pick<
  EntityInfo,
  "id" | "name" | "tags" | T
> &
  Partial<EntityInfo>;


type EntityDataQuery =  {
    /**
     * Filters to narrow down the requests from the API.
     */
    filters?:  Record<string, string | { start: string | null; end: string | null }>;
    /**
     * Amount of items to be fetched.
     */
    amount?: number;
    page?: number;
    /**
     * Amount of items to be skipped.
     */
    skip?: number;
    /**
     * Ordering for the requested data.
     */
    order?: any;
    /**
     * Timestamp to pin the requested data to a specific start date.
     */
    startDate?: string;
    /**
     * Timestamp to pin the requested data up to a specific end date.
     */
    endDate?: string;
  };

type EntityData = { id: GenericID } & Record<string, any>;

type EntityUnknownData = {
  [field: string]: any;
};

export {
 EntityIndex,
  EntityFieldType,
  EntityFieldInfo,
  EntityCreateInfo,
  EntityInfo,
  EntityQuery,
  EntityListItem,
  EntityDataQuery,
  EntityData,
  EntityUnknownData
};
