import { ExpireTimeOption, GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { InviteInfo, InviteResponse } from "./_share.types";
import Widgets from "./Dashboard.Widgets";
import {
  DashboardCreateInfo,
  DashboardInfo,
  DashboardQuery,
  DevicesRelated,
  AnalysisRelated,
  PublicKeyResponse,
} from "./dashboards.types";
import _Share from "./_Share";
import dateParser from "../Utils/dateParser";

class Dashboards extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list with all dashboards from the account
   * @default
   * ```json
   * queryObj: {
   *   page: 1,
   *   fields: ["id", "name"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "label,asc",
   * }
   * ```
   * @param queryObj Search query params
   */
  public async list(queryObj?: DashboardQuery): Promise<DashboardInfo[]> {
    let result = await this.doRequest<DashboardInfo[]>({
      path: "/dashboard",
      method: "GET",
      params: {
        page: queryObj?.page || 1,
        fields: queryObj?.fields || ["id", "name"],
        filter: queryObj?.filter || {},
        amount: queryObj?.amount || 20,
        orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "label,asc",
      },
    });

    result = result.map((data) => dateParser(data, ["created_at", "updated_at", "last_access"]));

    return result;
  }
  /**
   * Generates and retrieves a new dashboard from the account
   * @param dashboardObj Object data to create new Dashboard
   */
  public async create(dashboardObj: DashboardCreateInfo): Promise<{ dashboard: GenericID }> {
    const result = await this.doRequest<{ dashboard: GenericID }>({
      path: "/dashboard",
      method: "POST",
      body: {
        ...dashboardObj,
      },
    });

    return result;
  }

  /**
   * Modify any property of the action
   * @param dashboardID Dashboard identification
   * @param dashboardObj Dashboard Object with data to be replaced
   */
  public async edit(dashboardID: GenericID, dashboardObj: Partial<DashboardInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/dashboard/${dashboardID}`,
      method: "PUT",
      body: {
        ...dashboardObj,
      },
    });

    return result;
  }

  /**
   * Deletes an dashboard from the account
   * @param dashboardID Dashboard identification
   */
  public async delete(dashboardID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/dashboard/${dashboardID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Gets information about the dashboard
   * @param dashboardID Dashboard identification
   */
  public async info(dashboardID: GenericID): Promise<DashboardInfo> {
    let result = await this.doRequest<DashboardInfo>({
      path: `/dashboard/${dashboardID}`,
      method: "GET",
    });

    result = dateParser(result, ["created_at", "updated_at", "last_access"]);
    return result;
  }

  /**
   * Duplicate the dashboard to your own account
   * @param dashboardID Dashboard identification
   * @param dashboardObj Object with data of the duplicate dashboard
   */
  public async duplicate(
    dashboardID: GenericID,
    dashboardObj?: { setup?: object; new_label?: string }
  ): Promise<{ dashboard_id: string; message: string }> {
    const result = await this.doRequest<{ dashboard_id: string; message: string }>({
      path: `/dashboard/${dashboardID}/duplicate`,
      method: "POST",
      body: dashboardObj || {},
    });

    return result;
  }

  /**
   * Get share list of the dashboard
   * @param dashboardID Dashboard identification
   */
  public async shareList(dashboardID: GenericID): Promise<InviteInfo[]> {
    return this.share.list(dashboardID);
  }

  /**
   * Share the dashboard with another person
   * @param dashboardID Dashboard identification
   * @param inviteObj Object with target and message
   */
  public async shareSendInvite(dashboardID: GenericID, inviteObj: InviteInfo): Promise<InviteResponse> {
    return this.share.invite(dashboardID, inviteObj);
  }

  /**
   * Change permissions of the bucket
   * @param shareID Share identification
   * @param targetObj Object with target email and new permission
   */
  public async shareEdit(shareID: GenericID, targetObj: Partial<InviteInfo>): Promise<string> {
    return this.share.edit(shareID, targetObj);
  }

  /**
   * Remove share of the bucket
   * @param shareID Share identification
   */
  public async shareDelete(shareID: GenericID): Promise<string> {
    return this.share.remove(shareID);
  }

  /**
   * Generate a new public token for the dashboard
   * @param dashboardID Dashboard identification
   * @param expireTime Time when token will expire
   */
  public async getPublicKey(
    dashboardID: GenericID,
    expireTime: ExpireTimeOption = "never"
  ): Promise<PublicKeyResponse> {
    let result = await this.doRequest<PublicKeyResponse>({
      path: `/dashboard/${dashboardID}/share/public`,
      method: "GET",
      params: {
        expire_time: expireTime,
      },
    });

    result = dateParser(result, ["expire_time"]);

    return result;
  }

  /**
   * Get list of devices related with dashboard
   * @param dashboardID Dashboard identification
   */
  public async listDevicesRelated(dashboardID: GenericID): Promise<DevicesRelated[]> {
    const result = await this.doRequest<DevicesRelated[]>({
      path: `/dashboard/${dashboardID}/devices`,
      method: "GET",
    });

    return result;
  }

  /**
   * Get list of analysis related with a dashboard
   * @param dashboardID Dashboard identification
   */
  public async listAnalysisRelated(dashboardID: GenericID): Promise<AnalysisRelated[]> {
    const result = await this.doRequest<AnalysisRelated[]>({
      path: `/dashboard/${dashboardID}/analysis`,
      method: "GET",
    });

    return result;
  }

  /**
   * Runs an analysis located in a widget's header button
   * @param analysisID The id of the analysis to run
   * @param dashboardID The id of the dashboard that contains the widget
   * @param widgetID The id of the widget that contains the header button
   * @param scope Data to send to the analysis
   */
  public async runWidgetHeaderButtonAnalysis(
    analysisID: GenericID,
    dashboardID: GenericID,
    widgetID: GenericID,
    scope?: object
  ): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/analysis/${analysisID}/run/${dashboardID}/${widgetID}`,
      method: "POST",
      body: {
        scope,
      },
    });

    return result;
  }

  private share = new _Share({ ...this.params, type: "dashboard" });

  public widgets = new Widgets(this.params);
}

export default Dashboards;
