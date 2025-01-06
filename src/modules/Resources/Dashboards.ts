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
   * Lists all dashboards from your application with pagination support.
   *
   * @param {DashboardQuery} queryObj - Query parameters for filtering and pagination
   * @param {number} queryObj.page - Page number
   * @param {string[]} queryObj.fields - Fields to be returned
   * @param {object} queryObj.filter - Filter conditions
   * @param {number} queryObj.amount - Number of items per page
   * @param {[string, 'asc' | 'desc']} queryObj.orderBy - Field and direction to sort by
   * @returns {Promise<DashboardInfo[]>} List of dashboards
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
   * Creates a new dashboard in your application.
   *
   * @param {DashboardCreateInfo} dashboardObj - Dashboard configuration data
   * @returns {Promise<{dashboard: GenericID}>} Object containing the ID of created dashboard
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
   * Modifies an existing dashboard's properties.
   *
   * @param {GenericID} dashboardID - ID of the dashboard to be edited
   * @param {Partial<DashboardInfo>} dashboardObj - New dashboard configuration
   * @returns {Promise<string>} Success message
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
   * Deletes a dashboard from the application.
   *
   * @param {GenericID} dashboardID - ID of the dashboard to be deleted
   * @returns {Promise<string>} Success message
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
   * Retrieves detailed information about a specific dashboard.
   *
   * @param {GenericID} dashboardID - ID of the dashboard
   * @returns {Promise<DashboardInfo>} Dashboard details
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
   * Creates a copy of an existing dashboard.
   *
   * @param {GenericID} dashboardID - ID of the dashboard to duplicate
   * @param {Object} [dashboardObj] - Optional configuration for the duplicated dashboard
   * @param {Object} [dashboardObj.setup] - Custom setup for the new dashboard
   * @param {string} [dashboardObj.new_label] - New label for the duplicated dashboard
   * @returns {Promise<{dashboard_id: string, message: string}>} New dashboard ID and success message
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
   * Lists all users with access to the dashboard.
   *
   * @param {GenericID} dashboardID - ID of the dashboard
   * @returns {Promise<InviteInfo[]>} List of users with access
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
   * Generates a new public access token for the dashboard.
   *
   * @param {GenericID} dashboardID - ID of the dashboard
   * @param {ExpireTimeOption} expireTime - Token expiration time, defaults to "never"
   * @returns {Promise<PublicKeyResponse>} Public access token information
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
   * Lists all devices associated with the dashboard.
   *
   * @param {GenericID} dashboardID - ID of the dashboard
   * @returns {Promise<DevicesRelated[]>} List of related devices
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
   * Lists all analyses associated with a dashboard.
   *
   * @param {GenericID} dashboardID - ID of the dashboard to get related analyses
   * @returns {Promise<AnalysisRelated[]>} List of analyses related to the dashboard
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
   * Executes an analysis from a widget's header button.
   *
   * @param {GenericID} analysisID - ID of the analysis to run
   * @param {GenericID} dashboardID - ID of the dashboard containing the widget
   * @param {GenericID} widgetID - ID of the widget containing the header button
   * @param {object} [scope] - Optional data to send to the analysis
   * @returns {Promise<string>} Success message
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
