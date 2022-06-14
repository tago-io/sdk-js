import {
  GenericID,
  GenericToken,
  ListTokenQuery,
  TokenCreateResponse,
  TokenData,
  TokenDataList,
} from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { BillingAddOn } from "./billing.types";
import type {
  AddonInfo,
  AuditLog,
  AuditLogFilter,
  ProfileInfo,
  ProfileListInfo,
  ProfileSummary,
  StatisticsDate,
  UsageStatistic,
} from "./profile.types";

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

    if (result.info) result.info = dateParser(result.info, ["created_at", "updated_at"]);

    return result;
  }

  /**
   * Gets profile summary
   */
  public async summary(profileID: GenericID): Promise<ProfileSummary> {
    const result = await this.doRequest<ProfileSummary>({
      path: `/profile/${profileID}/summary`,
      method: "GET",
    });

    return result;
  }

  /**
   * Create a profile.
   *
   * If `allocate_free_resources` is passed as an option, all the free resources available
   * in allocation will be allocated to the new profile.
   *
   * @param profileObj Profile object with data to be created
   * @param options Options for the created profile.
   */
  public async create(
    profileObj: { name: string },
    options?: { allocate_free_resources?: boolean }
  ): Promise<{ id: GenericID }> {
    const { allocate_free_resources } = options || {};
    const params = {
      ...(allocate_free_resources && { allocate_free_resources }),
    };

    const result = await this.doRequest<{ id: GenericID }>({
      path: `/profile/`,
      method: "POST",
      body: profileObj,
      params,
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
   * List all the usage statistics of a profile.
   *
   * Usage statistics are cumulative: if a service was not used in a time period,
   * the statistics for that time period will not be in the object.
   *
   * @param profileID Profile identification
   * @param dateObj Object with date and their timezone
   *
   * @returns Array of cumulative usage statistics.
   *
   * @example
   *
   * ```json
   * [
   *   { "time": "2022-01-01T00:00:00.000Z", "input": 5 },
   *   { "time": "2022-01-02T00:00:00.000Z", "input": 5, "output": 10 },
   *   { "time": "2022-01-03T00:00:00.000Z", "input": 10, "output": 15 },
   * ]
   * ```
   */
  public async usageStatisticList(profileID: GenericID, dateObj?: StatisticsDate): Promise<UsageStatistic[]> {
    let result = await this.doRequest<UsageStatistic[]>({
      path: `/profile/${profileID}/statistics`,
      method: "GET",
      params: {
        ...dateObj,
      },
    });

    result = result.map((data) => dateParser(data, ["time"]));

    return result;
  }

  /**
   * Create a query for auditlog
   * @param profileID Profile identification
   * @param filterObj auditlog filter object
   */
  public async auditLog(profileID: GenericID, filterObj?: AuditLogFilter): Promise<AuditLog> {
    const result = await this.doRequest<AuditLog>({
      path: `/profile/${profileID}/auditlog`,
      method: "GET",
      params: filterObj || {},
    });

    result.events = result?.events.map((data) => dateParser(data, ["date"]));
    return result;
  }

  /**
   * Fetches the information from an auditlog query
   * @param profileID Profile identification
   * @param queryId auditlog queryId from auditLogCreate
   */
  public async auditLogQuery(profileID: GenericID, queryId?: string): Promise<AuditLog> {
    const result = await this.doRequest<AuditLog>({
      path: `/profile/${profileID}/auditlog/${queryId}`,
      method: "GET",
    });

    result.events = result?.events.map((data) => dateParser(data, ["date"]));
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
  public async tokenList(profileID: GenericID, queryObj?: ListTokenQuery): Promise<Partial<TokenDataList>[]> {
    let result = await this.doRequest<Partial<TokenDataList>[]>({
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

    result = result.map((data) => dateParser(data, ["last_authorization", "expire_time", "created_at"]));

    return result;
  }

  /**
   * Generates and retrieves a new token
   * @param profileID Profile ID
   * @param tokenParams Token params for new token
   */
  public async tokenCreate(profileID: GenericID, tokenParams: TokenData): Promise<TokenCreateResponse> {
    let result = await this.doRequest<TokenCreateResponse>({
      path: `/profile/${profileID}/token`,
      method: "POST",
      body: tokenParams,
    });

    result = dateParser(result, ["expire_date"]);

    return result;
  }

  /**
   * Deletes a token
   * @param token Token
   */
  public async tokenDelete(token: GenericToken): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/profile/token/${token}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Remove an add-on from a profile at the end of the billing cycle.
   *
   * @throws If profile ID is invalid.
   * @throws If profile doesn't have the add-on.
   *
   * @returns Success message.
   */
  public async removeAddOn(profileId: GenericID, addon: BillingAddOn): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/profile/${profileId}/${addon}`,
      method: "DELETE",
    });

    return result;
  }
}

export default Profile;
