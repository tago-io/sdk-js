import { ExpireTimeOption, GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { InviteInfo, InviteResponse } from "./_share.types";
import Widgets from "./Dashboard.Widgets";
import {
  DashboardCreateInfo,
  DashboardInfo,
  DashboardQuery,
  DevicesRelated,
  PublicKeyResponse,
} from "./dashboards.types";
import _Share from "./_Share";

class Dashboards extends TagoIOModule<GenericModuleParams> {
  private share = new _Share({ ...this.params, type: "dashboard" });

  public async list(query?: DashboardQuery): Promise<DashboardInfo[]> {
    const result = await this.doRequest<DashboardInfo[]>({
      path: "/dashboard",
      method: "GET",
      params: {
        page: query?.page || 1,
        fields: query?.fields || ["id", "name"],
        filter: query?.filter || {},
        amount: query?.amount || 20,
        orderBy: query?.orderBy ? `${query.orderBy[0]},${query.orderBy[1]}` : "label,asc",
      },
    });

    return result;
  }
  public async create(data: DashboardCreateInfo): Promise<{ dashboard: GenericID }> {
    const result = await this.doRequest<{ dashboard: GenericID }>({
      path: "/dashboard",
      method: "POST",
      body: {
        ...data,
      },
    });

    return result;
  }
  public async edit(dashboardID: GenericID, data: Partial<DashboardInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/dashboard/${dashboardID}`,
      method: "PUT",
      body: {
        ...data,
      },
    });

    return result;
  }
  public async delete(dashboardID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/dashboard/${dashboardID}`,
      method: "DELETE",
    });

    return result;
  }
  public async info(dashboardID: GenericID): Promise<DashboardInfo> {
    const result = await this.doRequest<DashboardInfo>({
      path: `/dashboard/${dashboardID}`,
      method: "GET",
    });

    return result;
  }
  public async duplicate(
    dashboardID: GenericID,
    data?: { setup?: object; new_label?: string }
  ): Promise<{ dashboard_id: string; message: string }> {
    const result = await this.doRequest<{ dashboard_id: string; message: string }>({
      path: `/dashboard/${dashboardID}/duplicate`,
      method: "POST",
      body: data || {},
    });

    return result;
  }

  public async shareList(dashboardID: GenericID): Promise<InviteInfo[]> {
    return this.share.list(dashboardID);
  }

  public async shareSendInvite(dashboardID: GenericID, data: InviteInfo): Promise<InviteResponse> {
    return this.share.invite(dashboardID, data);
  }

  public async shareEdit(dashboardID: GenericID, data: Partial<InviteInfo>): Promise<string> {
    return this.share.edit(dashboardID, data);
  }

  public async shareDelete(dashboardID: GenericID): Promise<string> {
    return this.share.remove(dashboardID);
  }

  public async getPublicKey(
    dashboardID: GenericID,
    expireTime: ExpireTimeOption = "never"
  ): Promise<PublicKeyResponse> {
    const result = await this.doRequest<PublicKeyResponse>({
      path: `/dashboard/${dashboardID}/share/public`,
      method: "GET",
      params: {
        expire_time: expireTime,
      },
    });

    return result;
  }

  public async listDevicesRelated(dashboardID: GenericID): Promise<DevicesRelated[]> {
    const result = await this.doRequest<DevicesRelated[]>({
      path: `/dashboard/${dashboardID}/devices`,
      method: "GET",
    });

    return result;
  }

  // TODO test
  public async runWidgetHeaderButtonAnalysis(
    analysisID: GenericID,
    dashboardID: GenericID,
    widgetID: GenericID,
    // TODO
    scope?: object
  ): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/analysis/${analysisID}/run/${dashboardID}/${widgetID}`,
      method: "POST",
    });

    return result;
  }

  // TODO dashboard id on constructor
  public widgets = new Widgets(this.params);
}

export default Dashboards;
