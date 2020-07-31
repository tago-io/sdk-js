import {
  GenericID,
  GenericToken,
  ListTokenQuery,
  TokenCreateResponse,
  TokenData,
  TokenDataList,
} from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { AddonInfo, AuditLogFilter, ProfileInfo, ProfileListInfo, UsageStatistic } from "./profile.types";

class Profile extends TagoIOModule<GenericModuleParams> {
  /**
   * Lists all the profiles in your account
   */
  public async list(): Promise<ProfileListInfo[]> {
    const result = await this.doRequest<ProfileListInfo[]>({
      path: "/profile",
      method: "GET",
    });

    return result;
  }

  /**
   * Get Profile info
   * @param profileID Profile identification
   */
  public async info(profileID: GenericID): Promise<ProfileInfo> {
    const result = await this.doRequest<ProfileInfo>({
      path: `/profile/${profileID}`,
      method: "GET",
    });

    return result;
  }

  /**
   * Create a profile
   * @param profileObj Profile object with data to be created
   */
  public async create(profileObj: { name: string }): Promise<{ id: GenericID }> {
    const result = await this.doRequest<{ id: GenericID }>({
      path: `/profile/`,
      method: "POST",
      body: profileObj,
    });

    return result;
  }

  /**
   * Edits a profile
   * @param profileObj Profile object with data to be changed
   */
  public async edit(profileID: GenericID, profileObj: Partial<ProfileInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/profile/${profileID}`,
      method: "PUT",
      body: profileObj,
    });

    return result;
  }

  /**
   * Delete profile
   * @param profileID Profile identification
   */
  public async delete(profileID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/profile/${profileID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * List all the usage statistics of your profile
   * @param profileID Profile identification
   * @param dateObj Object with date and their timezone
   */
  public async usageStatisticList(
    profileID: GenericID,
    dateObj?: { date?: string; timezone?: string }
  ): Promise<UsageStatistic[]> {
    const result = await this.doRequest<UsageStatistic[]>({
      path: `/profile/${profileID}/statistics`,
      method: "GET",
      params: {
        ...dateObj,
      },
    });

    return result;
  }

  /**
   * Fetches the information from auditlog of this profile
   * @param profileID Profile identification
   * @param filterObj auditlog filter object
   */
  public async auditLog(profileID: GenericID, filterObj?: AuditLogFilter): Promise<AuditLogFilter> {
    const result = await this.doRequest<AuditLogFilter>({
      path: `/profile/${profileID}/auditlog`,
      method: "GET",
      params: filterObj || {},
    });

    return result;
  }

  /**
   * Gets the information of addons for the profile
   * @param profileID Profile identification
   */
  public async addonList(profileID: GenericID): Promise<AddonInfo> {
    const result = await this.doRequest<AddonInfo>({
      path: `/profile/${profileID}/addons`,
      method: "GET",
    });

    return result;
  }

  /**
   * Sets the information of addons for the profile
   * @param profileID Profile identification
   * @param addonObj
   */
  public async addonEdit(profileID: GenericID, addonObj: Partial<AddonInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/profile/${profileID}/addons`,
      method: "POST",
      body: addonObj,
    });

    return result;
  }

  /**
   * Sets the information of services for the profile. Services are the main resources
   * in your profile, for example data input, data output, etc...
   * @param profileID Profile identification
   * @param serviceObj
   */
  public async serviceEdit(profileID: GenericID, serviceObj: object): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/profile/${profileID}/services`,
      method: "POST",
      body: serviceObj,
    });

    return result;
  }

  /**
   * Transforms the current token to another profile. The current profile will
   * no longer have the current token, as the current token will be acquired by the profile informed.
   * After this call is done, other requests using this token will work solely for the new profile, and
   * no longer for the current profile.
   * @param targetProfileID Profile identification
   */
  public async transferTokenToAnotherProfile(targetProfileID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/profile/switch/${targetProfileID}`,
      method: "PUT",
    });

    return result;
  }

  /**
   * Retrieves a list of all tokens
   * @param profileID Profile ID
   * @param queryObj Search query params
   */
  tokenList(profileID: GenericID, queryObj?: ListTokenQuery): Promise<Partial<TokenDataList>[]> {
    const result = this.doRequest<Partial<TokenDataList>[]>({
      path: `/profile/${profileID}/token`,
      method: "GET",
      params: {
        page: queryObj?.page || 1,
        fields: queryObj?.fields || ["name", "token", "permission"],
        filter: queryObj?.filter || {},
        amount: queryObj?.amount || 20,
        orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "created_at,desc",
      },
    });

    return result;
  }

  /**
   * Generates and retrieves a new token
   * @param profileID Profile ID
   * @param tokenParams Token params for new token
   */
  tokenCreate(profileID: GenericID, tokenParams: TokenData): Promise<TokenCreateResponse> {
    const result = this.doRequest<TokenCreateResponse>({
      path: `/profile/${profileID}/token`,
      method: "POST",
      body: tokenParams,
    });

    return result;
  }

  /**
   * Deletes a token
   * @param token Token
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
