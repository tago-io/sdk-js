import { GenericID, RecursivePartial } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { NotificationCreate, NotificationInfo } from "./notifications.types";
import {
  LoginResponseRun,
  RunInfo,
  UserCreateInfo,
  UserInfo,
  UserQuery,
  LoginAsUserOptions,
  RunSAMLInfo,
  RunSAMLEditInfo,
  CustomDomainCreate,
  CustomDomainInfo,
  CustomDomainResponse,
  UserCreateResponse,
  UserListItem,
} from "./run.types";

class Run extends TagoIOModule<GenericModuleParams> {
  /**
   * @description Retrieves information about the current Run environment configuration.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/191-tagorun} TagoRun
   * @see {@link https://help.tago.io/portal/en/kb/articles/run-themes} Run Themes
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const runInfo = await Resources.run.info();
   * console.log(runInfo);
   * ```
   */
  public async info(): Promise<RunInfo> {
    const result = await this.doRequest<RunInfo>({
      path: "/run",
      method: "GET",
    });

    return result;
  }

  /**
   * @description Updates the Run environment configuration settings.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/191-tagorun} TagoRun
   * @see {@link https://help.tago.io/portal/en/kb/articles/run-themes} Run Themes
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.run.edit({ name: "My Run Environment", logo: "https://example.com/logo.png" });
   * console.log(result);
   * ```
   */
  public async edit(data: RecursivePartial<RunInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/run",
      method: "PUT",
      body: data,
    });

    return result;
  }

  /**
   * @description Retrieves a paginated list of Run users with customizable fields and filtering options.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/191-tagorun} TagoRun
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const users = await Resources.run.listUsers({
   *   page: 1,
   *   fields: ["id", "name", "email"],
   *   amount: 20
   * });
   * console.log(users);
   * ```
   */
  public async listUsers<T extends UserQuery>(query: T) {
    let result = await this.doRequest<
      UserListItem<T["fields"] extends UserQuery["fields"] ? T["fields"][number] : "id" | "name">[]
    >({
      path: "/run/users",
      method: "GET",
      params: {
        page: query?.page || 1,
        fields: query?.fields || ["id", "name"],
        filter: query?.filter || {},
        amount: query?.amount || 20,
        orderBy: query?.orderBy ? `${query.orderBy[0]},${query.orderBy[1]}` : "name,asc",
      },
    });

    result = result.map((data) => dateParser(data, ["created_at", "updated_at", "last_login"]));

    return result;
  }

  /**
   * @description Retrieves detailed information about a specific Run user.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/191-tagorun} TagoRun
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const userInfo = await Resources.run.userInfo("user-id-123");
   * console.log(userInfo);
   * ```
   */
  public async userInfo(userID: GenericID): Promise<UserInfo> {
    let result = await this.doRequest<UserInfo>({
      path: `/run/users/${userID}`,
      method: "GET",
    });

    result = dateParser(result, ["created_at", "updated_at", "last_login"]);

    return result;
  }

  /**
   * @description Creates a new user in the Run environment.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/191-tagorun} TagoRun
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.run.userCreate({
   *   name: "John Doe",
   *   email: "john@example.com",
   *   password: "secure123",
   *   timezone: "America/New_York",
   * });
   * console.log(result);
   * ```
   */
  public async userCreate(data: UserCreateInfo): Promise<UserCreateResponse> {
    const result = await this.doRequest<UserCreateResponse>({
      path: `/run/users`,
      method: "POST",
      body: data,
    });

    return result;
  }

  /**
   * @description Updates information for an existing Run user.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/191-tagorun} TagoRun
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const userData = ;
   * const result = await Resources.run.userEdit("user-id-123", { name: "Updated Name", email: "new@example.com" });
   * console.log(result);
   * ```
   */
  public async userEdit(userID: GenericID, data: Partial<UserInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/users/${userID}`,
      method: "PUT",
      body: data,
    });

    return result;
  }

  /**
   * @description Permanently deletes a user from the Run environment.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/191-tagorun} TagoRun
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.run.userDelete("user-id-123");
   * console.log(result);
   * ```
   */
  public async userDelete(userID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/users/${userID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * @description Generates a login token to authenticate as a specific Run user.
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const loginResponse = await Resources.run.loginAsUser("user-id-123");
   * console.log(loginResponse.token);
   * ```
   */
  public async loginAsUser(userID: GenericID, options?: LoginAsUserOptions): Promise<LoginResponseRun> {
    let result = await this.doRequest<LoginResponseRun>({
      path: `/run/users/${userID}/login`,
      params: options,
      method: "GET",
    });

    result = dateParser(result, ["expire_date"]);

    return result;
  }

  /**
   * @description Tests the email configuration by sending a test message.
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.run.emailTest({ subject: "Test Email", body: "This is a test message" });
   * console.log(result);
   * ```
   */
  public async emailTest(data: { subject: string; body: string }): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/email_test`,
      method: "POST",
      body: data,
    });

    return result;
  }

  /**
   * @description Retrieves a list of notifications for a specific Run user.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/223-notifications-for-users} Notifications for Users
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const notifications = await Resources.run.notificationList("user-id-123");
   * console.log(notifications);
   * ```
   */
  public async notificationList(userID: GenericID): Promise<NotificationInfo[]> {
    const result = await this.doRequest<NotificationInfo[]>({
      path: `/run/notification/${userID}`,
      method: "GET",
    });

    return result;
  }

  /**
   * @description Creates a new notification for a Run user.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/223-notifications-for-users} Notifications for Users
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.run.notificationCreate("user-id-123", { title: "Update", message: "New feature available" });
   * console.log(result);
   * ```
   */
  public async notificationCreate(userID: GenericID, data: NotificationCreate): Promise<{ id: GenericID }> {
    const result = await this.doRequest<{ id: GenericID }>({
      path: `/run/notification/`,
      method: "POST",
      body: {
        run_user: userID,
        ...data,
      },
    });

    return result;
  }

  /**
   * @description Updates an existing notification in the Run environment.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/223-notifications-for-users} Notifications for Users
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.run.notificationEdit("notification-id-123", { title: "Updated Title" });
   * console.log(result);
   * ```
   */
  public async notificationEdit(notificationID: GenericID, data: Partial<NotificationCreate>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/notification/${notificationID}`,
      method: "PUT",
      body: data,
    });

    return result;
  }

  /**
   * @description Deletes a notification from the Run environment.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/223-notifications-for-users} Notifications for Users
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.run.notificationDelete("notification-id-123");
   * console.log(result);
   * ```
   */
  public async notificationDelete(notificationID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/notification/${notificationID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * @description Retrieves the SAML Single Sign-On configuration information for the Run environment.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/492-okta-sso} Okta SSO
   * @see {@link https://help.tago.io/portal/en/kb/articles/491-single-sign-on-sso} Single Sign-On (SSO)
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const samlConfig = await Resources.run.ssoSAMLInfo();
   * console.log(samlConfig);
   * ```
   */
  public async ssoSAMLInfo(): Promise<RunSAMLInfo> {
    const result = await this.doRequest<RunSAMLInfo>({
      path: "/run/sso/saml",
      method: "GET",
    });

    return result;
  }

  /**
   * @description Updates the SAML SSO configuration for the Run environment.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/492-okta-sso} Okta SSO
   * @see {@link https://help.tago.io/portal/en/kb/articles/491-single-sign-on-sso} Single Sign-On (SSO)
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.run.ssoSAMLEdit({
   *   idp_metadata: "xml-content",
   *   mapping: {
   *     email: "email_field",
   *     firstName: "name_field",
   *   }
   * });
   * console.log(result);
   * ```
   */
  public async ssoSAMLEdit(data: RunSAMLEditInfo): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/run/sso/saml",
      method: "PUT",
      body: data,
    });

    return result;
  }

  /**
   * @description Creates a custom domain configuration for the Run environment.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/custom-domain-configuration} Custom Domain Configuration
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.run.createCustomDomain("profile-123", {
   *  domain: "app.example.com",
   *  subdomain: "app.example.com",
   *  email: "example@email.com",
   * });
   * console.log(result);
   * ```
   */
  public async createCustomDomain(profile_id: string, customDomainData: CustomDomainCreate): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/customdomain/${profile_id}`,
      body: customDomainData,
      method: "POST",
    });

    return result;
  }

  /**
   * @description Retrieves the custom domain configuration for a Run profile.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/custom-domain-configuration} Custom Domain Configuration
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const domainInfo = await Resources.run.getCustomDomain("profile-id-123");
   * console.log(domainInfo);
   * ```
   */
  public async getCustomDomain(profile_id: string): Promise<CustomDomainInfo> {
    const result = await this.doRequest<CustomDomainResponse>({
      path: `/run/customdomain/${profile_id}`,
      method: "GET",
    });

    const parsedResult = dateParser(result, ["created_at"]) as unknown as CustomDomainInfo;

    return parsedResult;
  }

  /**
   * @description Removes the custom domain configuration from a Run profile.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/custom-domain-configuration} Custom Domain Configuration
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.run.deleteCustomDomain("profile-id-123");
   * console.log(result);
   * ```
   */
  public async deleteCustomDomain(profile_id: string): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/customdomain/${profile_id}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * @description Regenerates the custom domain configuration for a Run profile.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/custom-domain-configuration} Custom Domain Configuration
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.run.regenerateCustomDomain("profile-id-123");
   * console.log(result);
   * ```
   */
  public async regenerateCustomDomain(profile_id: string): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/customdomain/regenerate/${profile_id}`,
      method: "PUT",
    });

    return result;
  }
}

export default Run;
