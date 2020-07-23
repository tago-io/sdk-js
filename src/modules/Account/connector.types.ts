import { GenericID, Query, TokenData } from "../../common/common.types";

interface ConnectorCreateInfo {
  name: string;
  description_short?: string;
  description_full?: string;
  description_end?: string;
  logo_url?: string;
  options?: {};
}

interface ConnectorInfo extends ConnectorCreateInfo {
  id: GenericID;
  public: boolean;
  categories: string[];
  created_at: string;
  updated_at: string;
  parent: GenericID;
  hidden_parse: boolean;
}

interface ConnectorTokenInfo extends TokenData {
  created_at: string;
  updated_at: string;
  connector: GenericID;
  type: "type" | "connector";
}

type ConnectorQuery = Query<ConnectorInfo, "name" | "active" | "public" | "created_at" | "updated_at">;

export { ConnectorInfo, ConnectorCreateInfo, ConnectorTokenInfo, ConnectorQuery };
