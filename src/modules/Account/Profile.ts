import TagoIOModule, { GenericModuleParams } from "../../comum/TagoIOModule";
import {
  GenericID,
  GenericToken,
  TokenCreateResponse,
  TokenData,
  TokenDataList,
  ListTokenQuery,
} from "../../comum/comum.types";

interface ProfileListInfo {
  id: GenericID;
  name: string;
  logo_url: string | null;
}

interface ProfileInfo {
  info: {
    id: GenericID;
    account: GenericID;
    name: string;
    logo_url: string | null;
    created_at: string;
    updated_at: string;
  };
  limits: {
    profile: string;
    updated_at: string;
    input: number;
    output: number;
    sms: number;
    email: number;
    analysis: number;
    data_records: number;
  };
  auto_scale: object;
  account_plan: string;
}

interface UsageStatistic {
  input: number;
  input_peak: number;
  output: number;
  analysis: number;
  data_records: number;
  time: string;
  sms: number;
  email: number;
}

interface AuditLog {
  events: {
    resourceName: string;
    message: string;
    resourceID: GenericID;
    who: GenericID;
    date: string;
  }[];
  searchedLogStreams: {
    logStreamName: GenericID;
    searchedCompletely: boolean;
  }[];
  nextToken: string;
}

interface AuditLogFilter {
  nextToken?: string;
  ref_id?: GenericID;
  find?: "*" | string;
  start_date?: string;
  end_date?: string;
}

class Profile extends TagoIOModule<GenericModuleParams> {
  public async list(): Promise<ProfileListInfo[]> {
    const result = await this.doRequest<ProfileListInfo[]>({
      path: "/profile",
      method: "GET",
    });

    return result;
  }

  public async info(profileID: GenericID): Promise<ProfileInfo> {
    const result = await this.doRequest<ProfileInfo>({
      path: `/profile/${profileID}`,
      method: "GET",
    });

    return result;
  }

  public async create(data: { name: string }): Promise<{ id: GenericID }> {
    const result = await this.doRequest<{ id: GenericID }>({
      path: `/profile/`,
      method: "POST",
      body: data,
    });

    return result;
  }

  public async edit(profileID: GenericID, data: Partial<ProfileInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/profile/${profileID}`,
      method: "PUT",
      body: data,
    });

    return result;
  }

  public async delete(profileID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/profile/${profileID}`,
      method: "DELETE",
    });

    return result;
  }

  public async usageStatisticList(
    profileID: GenericID,
    time?: { date?: string; timezone?: string }
  ): Promise<UsageStatistic[]> {
    const result = await this.doRequest<UsageStatistic[]>({
      path: `/profile/${profileID}/statistics`,
      method: "GET",
      params: {
        ...time,
      },
    });

    return result;
  }

  public async auditLog(profileID: GenericID, filter?: AuditLogFilter): Promise<AuditLogFilter> {
    const result = await this.doRequest<AuditLogFilter>({
      path: `/profile/${profileID}/auditlog`,
      method: "GET",
      params: filter || {},
    });

    return result;
  }

  public async addonList(profileID: GenericID): Promise<object> {
    const result = await this.doRequest<object>({
      path: `/profile/${profileID}/addons`,
      method: "GET",
    });

    return result;
  }

  public async addonEdit(profileID: GenericID): Promise<object> {
    const result = await this.doRequest<object>({
      path: `/profile/${profileID}/addons`,
      method: "POST",
    });

    return result;
  }

  public async serviceEdit(profileID: GenericID): Promise<object> {
    const result = await this.doRequest<object>({
      path: `/profile/${profileID}/services`,
      method: "POST",
    });

    return result;
  }

  public async transferTokenToAnotherProfile(targetProfileID: GenericID): Promise<object> {
    const result = await this.doRequest<object>({
      path: `/profile/switch/${targetProfileID}`,
      method: "PUT",
    });

    return result;
  }

  /**
   * Retrieves a list of all tokens
   *
   * @param {GenericID} refID
   * @param {ListTokenQuery} [query] Search query params;
   * Default:{
   *   page: 1,
   *   fields: ["name", "token", "permission"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "created_at,desc",
   * }
   * @returns {Promise<Partial<TokenListResponse>[]>}
   * @memberof Token
   */
  tokenList(profileID: GenericID, query?: ListTokenQuery): Promise<Partial<TokenDataList>[]> {
    const result = this.doRequest<Partial<TokenDataList>[]>({
      path: `/profile/${profileID}/token`,
      method: "GET",
      params: {
        page: query?.page || 1,
        fields: query?.fields || ["name", "token", "permission"],
        filter: query?.filter || {},
        amount: query?.amount || 20,
        orderBy: query?.orderBy ? `${query.orderBy[0]},${query.orderBy[1]}` : "created_at,desc",
      },
    });

    return result;
  }

  /**
   * Generates and retrieves a new token
   *
   * @param {GenericID} refID
   * @param {TokenData} data New Token info
   * @returns {Promise<TokenCreateResponse>} Token created info
   * @memberof Token
   */
  tokenCreate(profileID: GenericID, data: TokenData): Promise<TokenCreateResponse> {
    const result = this.doRequest<TokenCreateResponse>({
      path: `/profile/${profileID}/token`,
      method: "POST",
      body: data,
    });

    return result;
  }

  /**
   * Deletes a token
   *
   * @param {GenericToken} token Token
   * @returns {Promise<string>} String with status
   * @memberof Token
   */
  tokenDelete(token: GenericToken): Promise<string> {
    const result = this.doRequest<string>({
      path: `/profile/token/${token}`,
      method: "DELETE",
    });

    return result;
  }
}

export default Profile;
