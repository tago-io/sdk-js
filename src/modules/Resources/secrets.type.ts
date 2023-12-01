import { GenericID, Query, TagsObj } from "../../common/common.types";

interface SecretsInfo {
  id: GenericID;
  key: string;
  value?: string;
  tags?: TagsObj[];
  value_length?: number;
}

type SecretsQuery = Query<SecretsInfo, "key">;

export { SecretsInfo, SecretsQuery };
