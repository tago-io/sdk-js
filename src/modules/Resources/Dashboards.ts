import type { ExpireTimeOption, GenericID } from "../../common/common.types.ts";
import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule.ts";
import dateParser from "../Utils/dateParser.ts";
import Widgets from "./Dashboard.Widgets.ts";
import type {
  AnalysisRelated,
  DashboardCreateInfo,
  DashboardInfo,
  DashboardQuery,
  DevicesRelated,
  PublicKeyResponse,
} from "./dashboards.types.ts";

class Dashboards extends TagoIOModule<GenericModuleParams> {
  /**
   * Lists all dashboards from your application with pagination support.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/15-dashboard-overview} Dashboard Overview
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Dashboard** / **Access** in Access Management.
   * ```typescript
   * const result = await Resources.dashboards.list({
   *   page: 1,
   *   fields: ["id", "name"],
   *   amount: 10,
   *   orderBy: ["label", "asc"]
   * });
   * console.log(result); // [ { id: 'dashboard-id-123', label: 'My Dashboard', ...}, ... ]
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
   * @see {@link https://help.tago.io/portal/en/kb/articles/15-dashboard-overview} Dashboard Overview
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Dashboard** / **Create** in Access Management.
   * ```typescript
   * const result = await Resources.dashboards.create({
   *   label: "My Dashboard",
   *   tags: [{ key: "type", value: "monitoring" }]
   * });
   * console.log(result); // { dashboard: 'dashboard-id-123' }
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
   * @see {@link https://help.tago.io/portal/en/kb/articles/15-dashboard-overview} Dashboard Overview
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Dashboard** / **Edit** in Access Management.
   * ```typescript
   * const result = await Resources.dashboards.edit("dashboard-id-123", {
   *   label: "Updated Dashboard",
   *   active: false
   * });
   * console.log(result); // Successfully Updated
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
   * @see {@link https://help.tago.io/portal/en/kb/articles/15-dashboard-overview} Dashboard Overview
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Dashboard** / **Delete** in Access Management.
   * ```typescript
   * const result = await Resources.dashboards.delete("dashboard-id-123");
   * console.log(result); // Successfully Removed
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
   * @see {@link https://help.tago.io/portal/en/kb/articles/15-dashboard-overview} Dashboard Overview
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Dashboard** / **Access** in Access Management.
   * ```typescript
   * const dashboardInfo = await Resources.dashboards.info("dashboard-id-123");
   * console.log(dashboardInfo); // { id: 'dashboard-id-123', label: 'My Dashboard', ... }
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
   * @see {@link https://help.tago.io/portal/en/kb/articles/15-dashboard-overview} Dashboard Overview
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Dashboard** / **Duplicate** in Access Management.
   * ```typescript
   * const result = await Resources.dashboards.duplicate("dashboard-id-123", { new_label: "Copy of My Dashboard" });
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
   * Generates a new public access token for the dashboard.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/15-dashboard-overview} Dashboard Overview
   *
   * @example
   * If receive an error "Authorization Denied", check policy in Access Management.
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const publicKey = await resources.dashboards.getPublicKey("dashboard-id-123", "1day");
   * console.log(publicKey); // { token: 'token-id-123', expire_time: '2025-01-02T00:00:00.000Z' }
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
   * @see {@link https://help.tago.io/portal/en/kb/articles/15-dashboard-overview} Dashboard Overview
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Dashboard** / **Related devices** in Access Management.
   * ```typescript
   * const devices = await Resources.dashboards.listDevicesRelated("dashboard-id-123");
   * console.log(devices); // [ { id: 'device-id-123' }, { id: 'device-id-xyz' }, ... ]
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
   * @see {@link https://help.tago.io/portal/en/kb/articles/15-dashboard-overview} Dashboard Overview
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Dashboard** / **Related analysis** in Access Management.
   * ```typescript
   * const analyses = await Resources.dashboards.listAnalysisRelated("dashboard-id-123");
   * console.log(analyses); // [ { id: 'analysis-id-123', name: 'Analysis #1' }, ... ]
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
   * @see {@link https://help.tago.io/portal/en/kb/articles/15-dashboard-overview} Dashboard Overview
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

  public widgets: Widgets = new Widgets(this.params);
}

export default Dashboards;
