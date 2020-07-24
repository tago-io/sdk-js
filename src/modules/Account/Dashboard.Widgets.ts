import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { GenericID, GenericToken } from "../../common/common.types";

interface WidgetInfo {
  analysis_run?: GenericID;
  dashboard?: GenericID;
  display?: object;
  //TODO
  data: object[];
  id?: GenericID;
  label: string;
  realtime?: boolean | null;
  type: string;
}

class Widgets extends TagoIOModule<GenericModuleParams> {
  // TODO
  public async create(dashboardID: GenericID, data: WidgetInfo): Promise<any> {
    const result = await this.doRequest<any>({
      path: `/dashboard/${dashboardID}/widget/`,
      method: "POST",
      body: data,
    });

    return result;
  }
  public async edit(dashboardID: GenericID, widgetID: GenericID, data: Partial<WidgetInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/dashboard/${dashboardID}/widget/${widgetID}`,
      method: "PUT",
      body: data,
    });

    return result;
  }
  public async delete(dashboardID: GenericID, widgetID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/dashboard/${dashboardID}/widget/${widgetID}`,
      method: "DELETE",
    });

    return result;
  }

  public async info(dashboardID: GenericID, widgetID: GenericID): Promise<WidgetInfo> {
    const result = await this.doRequest<WidgetInfo>({
      path: `/dashboard/${dashboardID}/widget/${widgetID}`,
      method: "GET",
    });

    return result;
  }
  // TODO
  public async getData(dashboardID: GenericID, widgetID: GenericID): Promise<object> {
    const result = await this.doRequest<object>({
      path: `/data/${dashboardID}/${widgetID}`,
      method: "GET",
    });

    return result;
  }

  public async sendData(
    dashboardID: GenericID,
    widgetID: GenericID,
    data: object,
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

  public async runAnalysis(dashboardID: GenericID, widgetID: GenericID, data: object): Promise<object> {
    const result = await this.doRequest<object>({
      path: `/data/${dashboardID}/${widgetID}/run`,
      method: "POST",
      body: data,
    });

    return result;
  }

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
  public async tokenGenerate(dashboardID: GenericID, widgetID: GenericID): Promise<{ widget_token: GenericToken }> {
    const result = await this.doRequest<{ widget_token: GenericToken }>({
      path: `/dashboard/${dashboardID}/widget/${widgetID}/token`,
      method: "GET",
    });

    return result;
  }
}

export default Widgets;
