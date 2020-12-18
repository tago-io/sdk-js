import { GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import {
  TemplateObjDashboard,
  TemplateObjAnalysis,
  TemplateInstallDashboard,
  TemplateInstallAnalysis,
  TemplateObj,
  TemplateInstallReturn,
} from "./template.types";

type TemplateInstallParams = TemplateInstallDashboard | TemplateInstallAnalysis;

class Template extends TagoIOModule<GenericModuleParams> {
  public async generateTemplate(template: TemplateObjDashboard | TemplateObjAnalysis): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/template`,
      method: "POST",
      body: template,
    });

    return result;
  }

  public async installTemplate(
    templateID: GenericID,
    installParams?: TemplateInstallParams
  ): Promise<TemplateInstallReturn> {
    const result = await this.doRequest<TemplateInstallReturn>({
      path: `/template/${templateID}`,
      method: "POST",
      body: installParams,
    });

    return result;
  }

  public async getTemplate(templateID: GenericID): Promise<TemplateObj> {
    let result = await this.doRequest<TemplateObj>({
      path: `/template/${templateID}`,
      method: "GET",
    });

    result = dateParser(result, ["created_at", "updated_at"]);

    return result;
  }
}

export default Template;
