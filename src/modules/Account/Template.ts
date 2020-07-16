import { GenericID } from "../../common/comum.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";

interface TemplateObj {
  dashboard: GenericID;
  name: string;
  image_logo?: string;
  image_main?: string;
  setup?: object;
}

interface TemplateInstallData {
  device: { id: GenericID; bucket: GenericID };
}

class Template extends TagoIOModule<GenericModuleParams> {
  generateTemplate(template: TemplateObj): Promise<string> {
    const result = this.doRequest<string>({
      path: `/template`,
      method: "POST",
      body: template,
    });

    return result;
  }

  installTemplate(templateID: GenericID, data?: TemplateInstallData): Promise<string> {
    const result = this.doRequest<string>({
      path: `/template`,
      method: "POST",
      body: data,
    });

    return result;
  }

  getTemplate(templateID: GenericID): Promise<object> {
    const result = this.doRequest<object>({
      path: `/template/${templateID}`,
      method: "GET",
    });

    return result;
  }
}

export default Template;
