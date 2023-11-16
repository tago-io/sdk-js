import { GenericID, Query, TagsObj } from "../../common/common.types";

interface SecretsInfo {
    id: GenericID;
    key: string;
    value?: string;
    tags?: TagsObj[];
  }

type SecretsQuery = Query<
    SecretsInfo,
    "key"
>;

export { SecretsInfo, SecretsQuery };