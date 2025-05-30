import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule";
import type { GenericID } from "../../common/common.types";
import dateParser from "../Utils/dateParser";
import type {
  TemplateInstallAnalysis,
  TemplateInstallDashboard,
  TemplateInstallReturn,
  TemplateObj,
  TemplateObjAnalysis,
  TemplateObjDashboard,
} from "./template.types";

type TemplateInstallParams = TemplateInstallDashboard | TemplateInstallAnalysis;

class Template extends TagoIOModule<GenericModuleParams> {
  /**
   * @description Creates a new template from a dashboard or analysis configuration.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/518-distributing-dashboards} Distributing Dashboards
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.template.generateTemplate({
   *   name: "My Dashboard Template",
   *   dashboard: "dashboard-id-123"
   * });
   * console.log(result);
   * ```
   */
  public async generateTemplate(template: TemplateObjDashboard | TemplateObjAnalysis): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/template`,
      method: "POST",
      body: template,
    });

    return result;
  }

  /**
   * @description Installs a template into the account, creating either a dashboard or analysis from the template configuration.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/518-distributing-dashboards} Distributing Dashboards
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.template.installTemplate("template-id-123");
   * console.log(result); // { dashboard: 'dashboard-id-123' }
   * ```
   */
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

  /**
   * @description Retrieves detailed information about a specific template.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/518-distributing-dashboards} Distributing Dashboards
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const template = await resources.template.getTemplate("template-id-123");
   * console.log(template); // { type: 'dashboard', name: 'My Dashboard Template', ... }
   * ```
   */
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
