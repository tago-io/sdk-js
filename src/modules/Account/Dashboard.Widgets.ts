import TagoIOModule, { GenericModuleParams } from "../../comum/TagoIOModule";
import { GenericID } from "../../comum/comum.types";
import { InviteResponse, InviteInfo } from "./account.types";

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

  public async info(dashboardID: GenericID, widgetID: GenericID): Promise<Readonly<WidgetInfo>> {
    const result = await this.doRequest<Readonly<WidgetInfo>>({
      path: `/dashboard/${dashboardID}/widget/${widgetID}`,
      method: "GET",
    });

    return result;
  }
}

export default Widgets;
