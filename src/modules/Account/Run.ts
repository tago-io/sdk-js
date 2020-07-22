import { GenericID, RecursivePartial } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { LoginResponse, NotificationCreateInfo, RunInfo, UserCreateInfo, UserInfo, UserQuery } from "./run.types";

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
    const result = await this.doRequest<Partial<UserInfo>[]>({
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

    return result;
  }

  public async userInfo(userID: GenericID): Promise<UserInfo> {
    const result = await this.doRequest<UserInfo>({
      path: `/run/users/${userID}`,
      method: "GET",
    });

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

  public async loginAsUser(userID: GenericID): Promise<LoginResponse> {
    const result = await this.doRequest<LoginResponse>({
      path: `/run/users/${userID}/login`,
      method: "GET",
    });

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

  public async notificationList(userID: GenericID): Promise<NotificationCreateInfo[]> {
    const result = await this.doRequest<NotificationCreateInfo[]>({
      path: `/run/notification/${userID}`,
      method: "GET",
    });

    return result;
  }

  public async notificationCreate(userID: GenericID, data: NotificationCreateInfo): Promise<{ id: GenericID }> {
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

  public async notificationEdit(notificationID: GenericID, data: Partial<NotificationCreateInfo>): Promise<string> {
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
}

export default Run;
