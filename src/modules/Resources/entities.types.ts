import { GenericID, Query, TagsObj } from "../../common/common.types";

type EntityFieldType = "uuid" | "string" | "int" | "float" | "json" | "timestamp" | "text" | "boolean";

type EntityFieldCreate = {
  action: "create";
  type?: EntityFieldType;
  required?: boolean;
};

type EntityFieldRename = {
  action: "rename";
  new_name: string;
};

type EntityFieldDelete = {
  action: "delete";
};

type EntitySchema = Record<string, EntityFieldCreate | EntityFieldRename | EntityFieldDelete | {}>;

type EntityIndex = Record<
  string,
  {
    fields?: string[];
  }
>;

type EntityCreateInfo = {
  name?: string;
  schema?: EntitySchema;
  index?: EntityIndex;
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

type EntityListItem<T extends EntityQuery["fields"][number] = "id"> = Pick<EntityInfo, "id" | "name" | "tags" | T> &
  Partial<EntityInfo>;

type EntityDataQuery = {
  /** Filters to narrow down the requests from the API. */
  filter?: Record<string, string | { start: string | null; end: string | null }>;
  /** Amount of items to be fetched. */
  amount?: number;
  page?: number;
  /** Amount of items to be skipped. */
  skip?: number;
  /** Ordering for the requested data. */
  order?: any;
  /** Timestamp to pin the requested data to a specific start date. */
  startDate?: string;
  /** Timestamp to pin the requested data up to a specific end date. */
  endDate?: string;
  /** Index to use for the query. */
  index?: string;
};

type EntityData = { id: GenericID } & Record<string, any>;

type EntityUnknownData = {
  [field: string]: any;
};

export {
  EntityIndex,
  EntitySchema,
  EntityFieldType,
  EntityCreateInfo,
  EntityInfo,
  EntityQuery,
  EntityListItem,
  EntityDataQuery,
  EntityData,
  EntityUnknownData,
};
