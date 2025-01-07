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
  ProfileTeam,
  StatisticsDate,
  UsageStatistic,
} from "./profile.types";

class Profile extends TagoIOModule<GenericModuleParams> {
  /**
   * @description Retrieves a list of all profiles associated with the current account.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/198-profiles} Profiles
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const profiles = await Resources.profiles.list();
   * console.log(profiles);
   * ```
   */
  public async list(): Promise<ProfileListInfo[]> {
    const result = await this.doRequest<ProfileListInfo[]>({
      path: "/profile",
      method: "GET",
    });

    return result;
  }

  /**
   * @description Retrieves detailed information about a specific profile using its ID or 'current' for the active profile.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/198-profiles} Profiles
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const profileInfo = await Resources.profiles.info("profile-id-123");
   * // Or get current profile
   * const currentProfile = await Resources.profiles.info("current");
   * console.log(profileInfo);
   * ```
   */
  public async info(profileID: GenericID | "current"): Promise<ProfileInfo> {
    const result = await this.doRequest<ProfileInfo>({
      path: `/profile/${profileID}`,
      method: "GET",
    });

    if (result.info) result.info = dateParser(result.info, ["created_at", "updated_at"]);

    return result;
  }

  /**
   * @description Retrieves a summary of the profile's usage and statistics.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/198-profiles} Profiles
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const summary = await Resources.profiles.summary("profile-id-123");
   * console.log(summary);
   * ```
   */
  public async summary(profileID: GenericID, options?: { onlyAmount?: boolean }): Promise<ProfileSummary> {
    const result = await this.doRequest<ProfileSummary>({
      path: `/profile/${profileID}/summary`,
      method: "GET",
      params: {
        ...(options?.onlyAmount && { onlyAmount: options.onlyAmount }),
      },
    });

    return result;
  }

  /**
   * @description Creates a new profile with the specified name and optional resource allocation settings.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/198-profiles#Adding_Profiles} Adding Profiles
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const profileData = { name: "New Profile" };
   * const options = { allocate_free_resources: true };
   * const result = await Resources.profiles.create(profileData, options);
   * console.log(result);
   * ```
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
   * @description Updates profile information with the provided data.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/198-profiles#Renaming_your_Profiles} Renaming your Profiles
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const profileData = { name: "Updated Profile Name" };
   * const result = await Resources.profiles.edit("profile-id-123", profileData);
   * console.log(result);
   * ```
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
   * @description Permanently removes a profile from the account.
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.profiles.delete("profile-id-123");
   * console.log(result);
   * ```
   */
  public async delete(profileID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/profile/${profileID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * @description Retrieves usage statistics for a profile within a specified time period.
   *
   * Usage statistics are cumulative: if a service was not used in a time period,
   * the statistics for that time period will not be in the object.
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const dateFilter: StatisticsDate = { start_date: "2023-01-01", end_date: "2023-12-31", periodicity: "day" };
   * const result = await Resources.profiles.usageStatisticList("profile-id-123", dateFilter);
   * console.log(result);
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
   * @description Creates a new audit log query for tracking profile activities.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/audit-log} Audit Log
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const filter = { start_date: new Date("2023-01-01"), end_date: new Date("2023-12-31") };
   * const logs = await Resources.profiles.auditLog("profile-id-123", filter);
   * console.log(logs);
   * ```
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
   * @description Retrieves audit log entries using a previously created query.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/audit-log} Audit Log
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const logs = await Resources.profiles.auditLogQuery("profile-id-123", "query-id-456");
   * console.log(logs);
   * ```
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
   * @description Retrieves a list of all add-ons associated with the profile.
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const addons = await Resources.profiles.addonList("profile-id-123");
   * console.log(addons);
   * ```
   */
  public async addonList(profileID: GenericID): Promise<AddonInfo> {
    const result = await this.doRequest<AddonInfo>({
      path: `/profile/${profileID}/addons`,
      method: "GET",
    });

    return result;
  }

  /**
   * @description Updates the add-on configuration for a profile.
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const addonData = { name: "editing-name" };
   * const result = await Resources.profiles.addonEdit("profile-id-123", addonData);
   * console.log(result);
   * ```
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
   * @description Updates service configuration and resource limits for a profile.
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const services = { data_input: 1000, data_output: 5000 };
   * const result = await Resources.profiles.serviceEdit("profile-id-123", services);
   * console.log(result);
   * ```
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
   * @description Transfers the current authentication token to another profile.
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.profiles.transferTokenToAnotherProfile("target-profile-123");
   * console.log(result);
   * ```
   */
  public async transferTokenToAnotherProfile(targetProfileID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/profile/switch/${targetProfileID}`,
      method: "PUT",
    });

    return result;
  }

  /**
   * @description Retrieves a list of all tokens associated with a specific profile.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/495-account-token} Account Token
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const query = {
   *   page: 1,
   *   amount: 20,
   *   fields: ["name", "token", "permission"]
   * };
   * const result = await Resources.profiles.tokenList("profile-id-123", query);
   * console.log(result);
   * ```
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
   * @description Creates a new authentication token for the specified profile.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/495-account-token} Account Token
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const tokenData: TokenData = { name: "API Access", permission: "full" };
   * const result = await Resources.profiles.tokenCreate("profile-id-123", tokenData);
   * console.log(result);
   * ```
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
   * @description Revokes and removes an authentication token from the profile.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/495-account-token} Account Token
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.profiles.tokenDelete("profile-id-123", "token-xyz");
   * console.log(result);
   * ```
   */
  public async tokenDelete(profileId: string, token: GenericToken): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/profile/${profileId}/token/${token}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * @description Removes an add-on from the profile at the end of the current billing cycle.
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.profiles.removeAddOn("profile-id-123", "addon-name");
   * console.log(result);
   * ```
   */
  public async removeAddOn(profileId: GenericID, addon: BillingAddOn): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/profile/${profileId}/${addon}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * @description Adds a new team member to the profile using their email address.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/106-sharing-your-profile} Team Management - Sharing your Profile
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.profiles.addTeamMember("profile-id-123", "user@example.com");
   * console.log(result);
   * ```
   */
  public async addTeamMember(id: string, email: string): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/profile/${id}/team`,
      method: "POST",
      body: {
        email,
      },
    });

    return result;
  }

  /**
   * @description Retrieves a list of all team members that have access to the specified profile.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/106-sharing-your-profile} Team Management - Sharing your Profile
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const team = await Resources.profiles.teamList("profile-id-123");
   * console.log(team);
   * ```
   */
  public async teamList(id: string): Promise<ProfileTeam[]> {
    const result = await this.doRequest<ProfileTeam[]>({
      path: `/profile/${id}/team`,
      method: "GET",
    });

    return result;
  }

  /**
   * @description Removes a team member from the profile.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/106-sharing-your-profile} Team Management - Sharing your Profile
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.profiles.deleteTeamMember("profile-id-123", "account-id-456");
   * console.log(result);
   * ```
   */
  public async deleteTeamMember(id: string, accountId: string): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/profile/${id}/team/${accountId}`,
      method: "DELETE",
    });

    return result;
  }
}

export default Profile;
