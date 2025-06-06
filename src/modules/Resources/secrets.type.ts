import type { GenericID, Query, TagsObj } from "../../common/common.types";

type SecretsValue = {
  value: string;
};

interface SecretsInfo {
  id: GenericID;
  key: string;
  tags?: TagsObj[];
  value_length: number;
  created_at: Date;
  updated_at: Date;
}

type SecretsCreate = Pick<SecretsInfo, "key"> & SecretsValue & Partial<Pick<SecretsInfo, "tags">>;

type SecretsEdit = Partial<Pick<SecretsInfo, "tags"> & SecretsValue>;

type SecretsQuery = Query<SecretsInfo, "key">;

export type { SecretsInfo, SecretsCreate, SecretsEdit, SecretsQuery };
