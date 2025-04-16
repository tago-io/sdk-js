import { Data, GenericID, GenericToken } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import {
  EditDataModel,
  EditDeviceResource,
  EditResourceOptions,
  GetDataModel,
  PostDataModel,
  WidgetInfo,
} from "./dashboards.types";

class Widgets extends TagoIOModule<GenericModuleParams> {
  /**
   * @description Creates a new widget for a specified dashboard with the given configuration.
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Dashboard** / **Create and Edit** in Access Management.
   * ```typescript
   * const result = await Resources.dashboards.widgets.create("dashboard-id-123", {
   *   data : [{
   *     origin: "origin-id-123",
   *     query: "last_value",
   *     variables: ["temperature"]
   *   }],
   *   display: {
   *     show_units: true,
   *     show_variables: true,
   *     variables: [{
   *       origin: "origin-id-123",
   *       variable: "temperature"
   *     }]
   *   },
   *   label: "Temperature",
   *   type: "display",
   * });
   * console.log(result); // { widget: "widget-id-456" }
   *
   * // To add the widget size to the dashboard
   * // Before running this, make sure doesn't have more widgets in the dashboard.
   * await Resources.dashboards.edit("dashboard-id-123", {
   *  arrangement: [{ widget_id: result.widget, width: 1, height: 2, minW: 1, minH: 2, x: 0, y: 0 }]
   * });
   * ```
   */
  public async create(dashboardID: GenericID, widgetObj: WidgetInfo): Promise<{ widget: GenericID }> {
    const result = await this.doRequest<any>({
      path: `/dashboard/${dashboardID}/widget/`,
      method: "POST",
      body: widgetObj,
    });

    return result;
  }

  /**
   * @description Updates an existing widget's configuration on a dashboard.
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Dashboard** / **Edit** in Access Management.
   * ```typescript
   * const result = await Resources.dashboards.widgets.edit("dashboard-id-123", "widget-id-456", {
   *   label: "Updated Temperature",
   * });
   * console.log(result); // Successfully Updated
   * ```
   */
  public async edit(dashboardID: GenericID, widgetID: GenericID, data: Partial<WidgetInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/dashboard/${dashboardID}/widget/${widgetID}`,
      method: "PUT",
      body: data,
    });

    return result;
  }

  /**
   * @description Permanently removes a widget from a dashboard.
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Dashboard** / **Delete and Edit** in Access Management.
   * ```typescript
   * const result = await Resources.dashboards.widgets.delete("dashboard-id-123", "widget-id-456");
   * console.log(result); // Successfully Removed
   *
   * // To remove sizes from all widgets from a dashboard
   * // Before running this, make sure doesn't have more widgets in the dashboard.
   * await Resources.dashboards.edit("dashboard-id-123", { arrangement: [] });
   * ```
   */
  public async delete(dashboardID: GenericID, widgetID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/dashboard/${dashboardID}/widget/${widgetID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * @description Retrieves detailed information about a specific widget.
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Dashboard** / **Access** in Access Management.
   * ```typescript
   * const result = await Resources.dashboards.widgets.info("dashboard-id-123", "widget-id-456");
   * console.log(result); // { id: "widget-id-456", data: [ { query: "last_value", ... }, ... ], ... }
   * ```
   */
  public async info(dashboardID: GenericID, widgetID: GenericID): Promise<WidgetInfo> {
    const result = await this.doRequest<WidgetInfo>({
      path: `/dashboard/${dashboardID}/widget/${widgetID}`,
      method: "GET",
    });

    return result;
  }

  /**
   * @description Retrieves data or resource list for a specific widget based on the given parameters.
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.dashboards.widgets.getData("dashboard-id-123", "widget-id-456", {
   *   start_date: "2025-01-01",
   *   end_date: "2025-12-31",
   *   timezone: "UTC"
   * });
   * console.log(result); // { widget: { analysis_run: null, dashboard: '6791456f8b726c0009adccec', ... }, ...}
   * ```
   */
  public async getData(dashboardID: GenericID, widgetID: GenericID, params?: GetDataModel): Promise<object> {
    const result = await this.doRequest<object>({
      path: `/data/${dashboardID}/${widgetID}`,
      method: "GET",
      params,
    });

    return result;
  }

  /**
   * @description Sends new data values to be displayed in the widget.
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.dashboards.widgets.sendData("dashboard-id-123", "widget-id-456", {
   *   origin: "origin-id-123",
   *   variable: "temperature",
   *   value: 25.5,
   *   unit: "C"
   * });
   * console.log(result); // [ '1 Data Added' ]
   * ```
   */
  public async sendData(
    dashboardID: GenericID,
    widgetID: GenericID,
    data: PostDataModel | PostDataModel[],
    bypassBucket: boolean = false
  ): Promise<object> {
    const result = await this.doRequest<object>({
      path: `/data/${dashboardID}/${widgetID}`,
      method: "POST",
      params: {
        bypass_bucket: bypassBucket,
      },
      body: data,
    });

    return result;
  }

  /**
   * @description Updates existing data values for a specific widget.
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.dashboards.widgets.editData("dashboard-id-123", "widget-id-456", {
   *   origin: "origin-id-123",
   *   id: "data-id-789",
   *   value: 25.5
   * });
   * console.log(result); // Device Data Updated
   * ```
   */
  public async editData(
    dashboardID: GenericID,
    widgetID: GenericID,
    data: EditDataModel | EditDataModel[],
    bypassBucket: boolean = false
  ): Promise<object> {
    const result = await this.doRequest<object>({
      path: `/data/${dashboardID}/${widgetID}/data`,
      method: "PUT",
      params: {
        bypass_bucket: bypassBucket,
      },
      body: data,
    });

    return result;
  }

  /**
   * @description Removes specific data points from the widget by their IDs.
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.dashboards.widgets.deleteData(
   *   "dashboard-id-123", "widget-id-456", "data-id-789", "device-id-123"
   * );
   * console.log(result); // Widget Data Removed
   * ```
   */
  public async deleteData(
    dashboardID: GenericID,
    widgetID: GenericID,
    variableID: GenericID,
    deviceID: GenericID
  ): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/data/${dashboardID}/${widgetID}`,
      method: "DELETE",
      params: {
        ids: `${variableID}:${deviceID}`,
      },
    });

    return result;
  }

  /**
   * @description Updates resource values associated with the widget.
   */
  public async editResource(
    dashboardID: GenericID,
    widgetID: GenericID,
    resourceData: EditDeviceResource | EditDeviceResource[],
    options?: EditResourceOptions
  ): Promise<object> {
    const result = await this.doRequest<object>({
      path: `/data/${dashboardID}/${widgetID}/resource`,
      method: "PUT",
      params: {
        widget_exec: options?.identifier,
      },
      body: resourceData,
    });

    return result;
  }

  /**
   * @description Generates a new authentication token for embedding a widget. Each call regenerates the token.
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.dashboards.widgets.tokenGenerate("dashboard-id-123", "widget-id-456");
   * console.log(result); // { widget_token: "widget-token-123" }
   * ```
   */
  public async tokenGenerate(dashboardID: GenericID, widgetID: GenericID): Promise<{ widget_token: GenericToken }> {
    const result = await this.doRequest<{ widget_token: GenericToken }>({
      path: `/dashboard/${dashboardID}/widget/${widgetID}/token`,
      method: "GET",
    });

    return result;
  }
}

export default Widgets;
