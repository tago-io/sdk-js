import { GenericID, Query, TagsObj } from "../../common/common.types";

interface SecretsInfo {
  id: GenericID;
  key: string;
  value?: string;
  tags?: TagsObj[];
  value_length?: number;
  created_at?: Date;
  updated_at?: Date;
}

type SecretsQuery = Query<SecretsInfo, "key">;

export { SecretsInfo, SecretsQuery };
