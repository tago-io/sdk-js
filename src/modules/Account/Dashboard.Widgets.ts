import { Data, GenericID, GenericToken } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { EditDataModel, EditDeviceResource, GetDataModel, PostDataModel, WidgetInfo } from "./dashboards.types";

class Widgets extends TagoIOModule<GenericModuleParams> {
  /**
   * Create a Dashboard Widget
   * @param dashboardID Dashboard identification
   * @param widgetObj
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
   * Edit the Dashboard Widget
   * @param dashboardID Dashboard identification
   * @param widgetID Widget identification
   * @param data
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
   * Delete the Dashboard Widget
   * @param dashboardID Dashboard identification
   * @param widgetID Widget identification
   */
  public async delete(dashboardID: GenericID, widgetID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/dashboard/${dashboardID}/widget/${widgetID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Get Info of the Dashboard Widget
   * @param dashboardID Dashboard identification
   * @param widgetID Widget identification
   */
  public async info(dashboardID: GenericID, widgetID: GenericID): Promise<WidgetInfo> {
    const result = await this.doRequest<WidgetInfo>({
      path: `/dashboard/${dashboardID}/widget/${widgetID}`,
      method: "GET",
    });

    return result;
  }

  /**
   * Get all data or resource list for the current widget
   * @param dashboardID Dashboard identification
   * @param widgetID Widget identification
   * @param overwrite It can overwrite 'start_date', 'end_date', 'timezone' fields
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
   * Send value of variable for the current widget
   * @param dashboardID Dashboard identification
   * @param widgetID Widget identification
   * @param data
   * @param bypassBucket
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
   * Update value of variable for the current widget
   * @param dashboardID Dashboard identification
   * @param widgetID Widget identification
   * @param data
   * @param bypassBucket
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
   * Update value of a resource for the current widget
   * @param dashboardID Dashboard identification
   * @param widgetID Widget identification
   * @param data
   * @param bypassBucket
   */
  public async editResource(
    dashboardID: GenericID,
    widgetID: GenericID,
    resourceData: EditDeviceResource | EditDeviceResource[]
  ): Promise<object> {
    const result = await this.doRequest<object>({
      path: `/data/${dashboardID}/${widgetID}/resource`,
      method: "PUT",
      params: {},
      body: resourceData,
    });

    return result;
  }

  /**
   * Run analysis without inserting data to bucket
   * @param dashboardID Dashboard identification
   * @param widgetID Widget identification
   * @param data
   */
  public async runAnalysis(dashboardID: GenericID, widgetID: GenericID, data: [object | Data]): Promise<object> {
    const result = await this.doRequest<object>({
      path: `/data/${dashboardID}/${widgetID}/run`,
      method: "POST",
      body: data,
    });

    return result;
  }

  /**
   * Delete data by it's id, bucket and variable must be associeted with the widget
   * @param dashboardID Dashboard identification
   * @param widgetID Widget identification
   * @param ids
   */
  public async deleteData(dashboardID: GenericID, widgetID: GenericID, ids: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/data/${dashboardID}/${widgetID}`,
      method: "DELETE",
      params: {
        ids,
      },
    });

    return result;
  }

  /**
   * Generate a new token for the embed widgets
   * It can regenerate the token if call it multi-times
   * @param dashboardID Dashboard identification
   * @param widgetID Widget identification
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
