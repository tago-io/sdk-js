import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule";
import type {
  Authenticator,
  GenericID,
  GenericToken,
  ListTokenQuery,
  TokenCreateResponse,
  TokenData,
  TokenDataList,
} from "../../common/common.types";
import dateParser from "../Utils/dateParser";
import type { BillingAddOn } from "./billing.types";

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
   * If receive an error "Authorization Denied", check policy **Account** / **Access profile** in Access Management.
   * ```typescript
   * const result = await Resources.profiles.list();
   * console.log(result); // [ { id: 'profile-id-123', name: 'Profile Test', ... } ]
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
   * If receive an error "Authorization Denied", check policy **Account** / **Access profile** in Access Management.
   * ```typescript
   * const profileInfo = await Resources.profiles.info("profile-id-123");
   * // Or get current profile
   * const currentProfile = await Resources.profiles.info("current");
   * console.log(profileInfo); // { info { id: 'profile-id-123', account: 'account-id-123', ...}, ... }
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
   * If receive an error "Authorization Denied", check policy **Account** / **Access profile** in Access Management.
   * ```typescript
   * const result = await Resources.profiles.summary("profile-id-123");
   * console.log(result); // { amount: { device: 10, bucket: 10, dashboard: 5, ... }, ... }
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
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.profiles.create({ name: "New Profile" }, { allocate_free_resources: true });
   * console.log(result); // { id: 'profile-id-123' }
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
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.profiles.edit("profile-id-123", { name: "Updated Profile Name" });
   * console.log(result); // Successfully Updated
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
   * @see {@link https://help.tago.io/portal/en/kb/articles/526-two-factor-authentication} Two-Factor Authentication (2FA)
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * // The “pin_code” field is required when 2FA is activated
   * const result = await resources.profiles.delete("profile-id-123", { password: "your-password", pin_code: "123456" });
   * console.log(result); // Successfully Removed
   * ```
   */
  public async delete(profileID: GenericID, credentials: { password: string; pin_code?: string }): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/profile/${profileID}`,
      method: "DELETE",
      body: credentials,
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
   * If receive an error "Authorization Denied", check policy **Account** / **Access profile statistics** in Access Management.
   * ```typescript
   * const result = await Resources.profiles.usageStatisticList("profile-id-123", {
   *   start_date: "2024-09-01",
   *   end_date: "2024-12-31",
   *   periodicity: "day"
   * });
   * console.log(result); // [ { time: '2024-09-02T00:01:29.749Z', analysis: 0.07, data_records: 67254, ... }, ... ]
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
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.profiles.auditLog("profile-id-123", {
   *   start_date: new Date("2024-12-01"),
   *   end_date: new Date("2024-12-07")
   * });
   * console.log(result);
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
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await Resources.profiles.auditLogQuery("profile-id-123", "query-id-456");
   * console.log(result);
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
   * @deprecated This route is deprecated.
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
   * @deprecated This route is deprecated.
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
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.profiles.transferTokenToAnotherProfile("target-profile-123");
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
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.profiles.tokenList("profile-id-123", {
   *   page: 1,
   *   amount: 20,
   *   fields: ["name", "token", "permission"]
   * });
   * console.log(result); // [ { name: 'Token #1', token: 'token-value', permission: 'full', ... }, ... ]
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
   * @see {@link https://help.tago.io/portal/en/kb/articles/526-two-factor-authentication} Two-Factor Authentication (2FA)
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * // The “pin_code” / "otp_type" field is required when 2FA is activated
   * const result = await resources.profiles.tokenCreate("profile-id-123", {
   *   name: "API Access",
   *   permission: "full",
   *   email: "example@email.com",
   *   password: "your-password"
   *  });
   * console.log(result); // { token: 'token-value', name: 'API Access', ... }
   * ```
   */
  public async tokenCreate(profileID: GenericID, tokenParams: TokenData & Authenticator): Promise<TokenCreateResponse> {
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
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.profiles.tokenDelete("profile-id-123", "token-xyz");
   * console.log(result); // Token Successfully Removed
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
   * @deprecated This route is deprecated.
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
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.profiles.addTeamMember("profile-id-123", "user@example.com");
   * console.log(result); // User invited
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
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.profiles.teamList("profile-id-123");
   * console.log(result); // [ { id: 'account-id-123', active: false, name: 'John Doe', ... }, ... ]
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
   * If receive an error "Authorization Denied", check policy in Access Management.
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.profiles.deleteTeamMember("profile-id-123", "account-id-456");
   * console.log(result); // Account Successfully Removed
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
