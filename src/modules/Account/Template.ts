import { GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
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
  generateTemplate(template: TemplateObjDashboard | TemplateObjAnalysis) {
    const result = this.doRequest<string>({
      path: `/template`,
      method: "POST",
      body: template,
    });

    return result;
  }

  installTemplate(templateID: GenericID, installParams?: TemplateInstallParams): Promise<TemplateInstallReturn> {
    const result = this.doRequest<TemplateInstallReturn>({
      path: `/template/${templateID}`,
      method: "POST",
      body: installParams,
    });

    return result;
  }

  getTemplate(templateID: GenericID): Promise<TemplateObj> {
    const result = this.doRequest<TemplateObj>({
      path: `/template/${templateID}`,
      method: "GET",
    });

    return result;
  }
}

export default Template;
