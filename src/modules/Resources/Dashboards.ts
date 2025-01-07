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
   * @description Lists all dashboards from your application with pagination support.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/15-dashboard-overview} Dashboard Overview
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const list = await Resources.dashboards.list({
   *   page: 1,
   *   fields: ["id", "name"],
   *   amount: 10,
   *   orderBy: ["name", "asc"]
   * });
   * console.log(list);
   * ```
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
   * @description Creates a new dashboard in your application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/15-dashboard-overview} Dashboard Overview
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const newDashboard = await Resources.dashboards.create({
   *   label: "My Dashboard",
   *   tags: [{ key: "type", value: "monitoring" }]
   * });
   * console.log(newDashboard.dashboard);
   * ```
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
   * @description Modifies an existing dashboard's properties.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/15-dashboard-overview} Dashboard Overview
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.dashboards.edit("dashboard-id-123", {
   *   label: "Updated Dashboard",
   *   active: false
   * });
   * console.log(result);
   * ```
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
   * @description Deletes a dashboard from the application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/15-dashboard-overview} Dashboard Overview
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.dashboards.delete("dashboard-id-123");
   * console.log(result);
   * ```
   */
  public async delete(dashboardID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/dashboard/${dashboardID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * @description Retrieves detailed information about a specific dashboard.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/15-dashboard-overview} Dashboard Overview
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const dashboardInfo = await Resources.dashboards.info("dashboard-id-123");
   * console.log(dashboardInfo);
   * ```
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
   * @description Creates a copy of an existing dashboard.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/15-dashboard-overview} Dashboard Overview
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.dashboards.duplicate("dashboard-id-123", {
   *   new_label: "Copy of My Dashboard"
   * });
   * console.log(result);
   * ```
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
   * @description Lists all users with access to the dashboard.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/17-sharing-dashboards} Sharing Dashboards
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const shareList = await Resources.dashboards.shareList("dashboard-id-123");
   * console.log(shareList);
   * ```
   */
  public async shareList(dashboardID: GenericID): Promise<InviteInfo[]> {
    return this.share.list(dashboardID);
  }

  /**
   * @description Sends an invitation to share a dashboard with another user.
   * This allows collaborative access to dashboard resources.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/17-sharing-dashboards} Sharing Dashboards
   *
   * @example
   * ```typescript
   * const inviteInfo = {
   *   target: "user@example.com",
   *   message: "Please review this dashboard"
   * };
   * const result = await Resources.dashboards.shareSendInvite("dashboard-123", inviteInfo);
   * console.log(result);
   * ```
   */
  public async shareSendInvite(dashboardID: GenericID, inviteObj: InviteInfo): Promise<InviteResponse> {
    return this.share.invite(dashboardID, inviteObj);
  }

  /**
   * @description Modifies the access permissions for a shared dashboard. Use this to update user privileges.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/17-sharing-dashboards} Sharing Dashboards
   *
   * @example
   * ```typescript
   * const updateInfo = {
   *   target: "user@example.com",
   *   permission: "write"
   * };
   * const result = await Resources.dashboards.shareEdit("share-123", updateInfo);
   * console.log(result);
   * ```
   */
  public async shareEdit(shareID: GenericID, targetObj: Partial<InviteInfo>): Promise<string> {
    return this.share.edit(shareID, targetObj);
  }

  /**
   * @description Removes sharing access for a specific dashboard. This permanently revokes user access.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/17-sharing-dashboards} Sharing Dashboards
   *
   * @example
   * ```typescript
   * const result = await Resources.dashboards.shareDelete("share-123");
   * console.log(result);
   * ```
   */
  public async shareDelete(shareID: GenericID): Promise<string> {
    return this.share.remove(shareID);
  }

  /**
   * @description Generates a new public access token for the dashboard.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/15-dashboard-overview} Dashboard Overview
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const publicKey = await Resources.dashboards.getPublicKey("dashboard-id-123", "1day");
   * console.log(publicKey);
   * ```
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
   * @description Lists all devices associated with the dashboard.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/15-dashboard-overview} Dashboard Overview
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const devices = await Resources.dashboards.listDevicesRelated("dashboard-id-123");
   * console.log(devices);
   * ```
   */
  public async listDevicesRelated(dashboardID: GenericID): Promise<DevicesRelated[]> {
    const result = await this.doRequest<DevicesRelated[]>({
      path: `/dashboard/${dashboardID}/devices`,
      method: "GET",
    });

    return result;
  }

  /**
   * @description Lists all analyses associated with a dashboard.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/15-dashboard-overview} Dashboard Overview
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const analyses = await Resources.dashboards.listAnalysisRelated("dashboard-id-123");
   * console.log(analyses);
   * ```
   */
  public async listAnalysisRelated(dashboardID: GenericID): Promise<AnalysisRelated[]> {
    const result = await this.doRequest<AnalysisRelated[]>({
      path: `/dashboard/${dashboardID}/analysis`,
      method: "GET",
    });

    return result;
  }

  /**
   * @description Executes an analysis from a widget's header button.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/15-dashboard-overview} Dashboard Overview
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.dashboards.runWidgetHeaderButtonAnalysis(
   *   "analysis-id-123",
   *   "dashboard-id-123",
   *   "widget-id-123",
   * );
   * console.log(result);
   * ```
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
