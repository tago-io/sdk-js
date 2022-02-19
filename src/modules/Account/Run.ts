import { GenericID, RecursivePartial } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { NotificationCreate, NotificationInfo } from "./notifications.types";
import {
  LoginResponse,
  RunInfo,
  UserCreateInfo,
  UserInfo,
  UserQuery,
  LoginAsUserOptions,
  RunSAMLInfo,
  RunSAMLEditInfo,
  CustomDomain,
  CustomDomainResponse,
} from "./run.types";

class Run extends TagoIOModule<GenericModuleParams> {
  public async info(): Promise<RunInfo> {
    const result = await this.doRequest<RunInfo>({
      path: "/run",
      method: "GET",
    });

    return result;
  }

  public async edit(data: RecursivePartial<RunInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/run",
      method: "PUT",
      body: data,
    });

    return result;
  }

  public async listUsers(query: UserQuery): Promise<Partial<UserInfo>[]> {
    let result = await this.doRequest<Partial<UserInfo>[]>({
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

  public async userInfo(userID: GenericID): Promise<UserInfo> {
    let result = await this.doRequest<UserInfo>({
      path: `/run/users/${userID}`,
      method: "GET",
    });

    result = dateParser(result, ["created_at", "updated_at", "last_login"]);

    return result;
  }

  public async userCreate(data: UserCreateInfo): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/users`,
      method: "POST",
      body: data,
    });

    return result;
  }

  public async userEdit(userID: GenericID, data: Partial<UserInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/users/${userID}`,
      method: "PUT",
      body: data,
    });

    return result;
  }

  public async userDelete(userID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/users/${userID}`,
      method: "DELETE",
    });

    return result;
  }

  public async loginAsUser(userID: GenericID, options?: LoginAsUserOptions): Promise<LoginResponse> {
    let result = await this.doRequest<LoginResponse>({
      path: `/run/users/${userID}/login`,
      params: options,
      method: "GET",
    });

    result = dateParser(result, ["expire_date"]);

    return result;
  }

  public async emailTest(data: { subject: string; body: string }): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/email_test`,
      method: "POST",
      body: data,
    });

    return result;
  }

  public async notificationList(userID: GenericID): Promise<NotificationInfo[]> {
    const result = await this.doRequest<NotificationInfo[]>({
      path: `/run/notification/${userID}`,
      method: "GET",
    });

    return result;
  }

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

  public async notificationEdit(notificationID: GenericID, data: Partial<NotificationCreate>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/notification/${notificationID}`,
      method: "PUT",
      body: data,
    });

    return result;
  }

  public async notificationDelete(notificationID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/notification/${notificationID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Get the SAML Single Sign-On information for the account's RUN.
   */
  public async ssoSAMLInfo(): Promise<RunSAMLInfo> {
    const result = await this.doRequest<RunSAMLInfo>({
      path: "/run/sso/saml",
      method: "GET",
    });

    return result;
  }

  /**
   * Edit the SAML Single Sign-On metadata and mappings for the account's RUN.
   *
   * @param data Updated data for a RUN's SAML Single Sign-On configuration.
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
   * Create a TagoRUN custom domain for the profile.
   *
   * @param customDomainData query params
   * @returns Success message.
   */
  public async createCustomDomain(customDomainData: CustomDomain): Promise<string> {
    const result = await this.doRequest<string>({
      path: "run/custom_domain",
      method: "PUT",
    });

    return result;
  }

  /**
   * Get details of TagoRun custom domain for the profile.
   *
   * @returns CustomDomainResponse.
   */
  public async getCustomDomain(): Promise<CustomDomainResponse> {
    const result = await this.doRequest<CustomDomainResponse>({
      path: "run/custom_domain",
      method: "GET",
    });

    return result;
  }

  /**
   * delete a TagoRUN custom domain for the profile.
   *
   * @returns Success message.
   */
  public async deleteCustomDomain(): Promise<string> {
    const result = await this.doRequest<string>({
      path: "run/custom_domain",
      method: "DELETE",
    });

    return result;
  }

  /**
   * Regenerate a TagoRUN custom domain for the profile.
   *
   * @returns Success message.
   */
  public async regenerateCustomDomain(): Promise<string> {
    const result = await this.doRequest<string>({
      path: "run/custom_domain/regenerate",
      method: "PUT",
    });

    return result;
  }
}

export default Run;
