import { GenericID, GenericToken } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { AnalysisCreateInfo, AnalysisInfo, AnalysisListItem, AnalysisQuery, ScriptFile } from "./analysis.types";

class Analyses extends TagoIOModule<GenericModuleParams> {
  /**
   * @description Lists all analyses from the application with pagination support.
   * Use this to retrieve and manage analyses in your application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/analysis} Analysis
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const list = await Resources.analysis.list({
   *   page: 1,
   *   fields: ["id", "name"],
   *   amount: 10,
   *   orderBy: ["name", "asc"]
   * });
   * console.log(list);
   * ```
   */
  public async list<T extends AnalysisQuery>(queryObj?: T) {
    let result = await this.doRequest<
      AnalysisListItem<T["fields"] extends AnalysisQuery["fields"] ? T["fields"][number] : "id" | "name">[]
    >({
      path: "/analysis/",
      method: "GET",
      params: {
        page: queryObj?.page || 1,
        fields: queryObj?.fields || ["id", "name"],
        filter: queryObj?.filter || {},
        amount: queryObj?.amount || 20,
        orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "name,asc",
      },
    });

    result = result.map((data) => dateParser(data, ["created_at", "updated_at", "last_run"]));

    return result;
  }

  /**
   * @description Creates a new analysis in your application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/120-creating-analysis} Creating Analysis
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const newAnalysis = await Resources.analysis.create({
   *   name: "My Analysis",
   *   type: "node",
   *   tags: [{ key: "type", value: "data-processing" }]
   * });
   * console.log(newAnalysis.id, newAnalysis.token);
   * ```
   */
  public async create(analysisObj: AnalysisCreateInfo): Promise<{ id: GenericID; token: GenericToken }> {
    const result = await this.doRequest<{ id: GenericID; token: GenericToken }>({
      path: `/analysis`,
      method: "POST",
      body: {
        ...analysisObj,
      },
    });

    return result;
  }

  /**
   * @description Modifies an existing analysis.
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/analysis} Analysis
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.analysis.edit("analysis-id-123", {
   *   name: "Updated Analysis",
   *   active: false
   * });
   * console.log(result);
   * ```
   */
  public async edit(analysisID: GenericID, analysisObj: Partial<AnalysisInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/analysis/${analysisID}`,
      method: "PUT",
      body: {
        ...analysisObj,
      },
    });

    return result;
  }

  /**
   * @description Deletes an analysis from your application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/analysis} Analysis
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.analysis.delete("analysis-id-123");
   * console.log(result);
   * ```
   */
  public async delete(analysisID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/analysis/${analysisID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * @description Retrieves detailed information about a specific analysis.
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/analysis} Analysis
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const analysisInfo = await Resources.analysis.info("analysis-id-123");
   * console.log(analysisInfo);
   * ```
   */
  public async info(analysisID: GenericID): Promise<AnalysisInfo> {
    let result = await this.doRequest<AnalysisInfo>({
      path: `/analysis/${analysisID}`,
      method: "GET",
    });

    result = dateParser(result, ["created_at", "updated_at", "last_run"]);

    return result;
  }

  /**
   * @description Executes an analysis with optional scope parameters.
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/analysis} Analysis
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.analysis.run("analysis-id-123", {
   *   environment: "production"
   * });
   * console.log(result.analysis_token);
   * ```
   */
  public async run(analysisID: GenericID, scopeObj?: Object | any): Promise<{ analysis_token: GenericToken }> {
    const result = await this.doRequest<{ analysis_token: GenericToken }>({
      path: `/analysis/${analysisID}/run`,
      method: "POST",
      body: {
        scope: scopeObj,
      },
    });

    return result;
  }

  /**
   * @description Generates a new token for the analysis.
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/analysis} Analysis
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const token = await Resources.analysis.tokenGenerate("analysis-id-123");
   * console.log(token.analysis_token);
   * ```
   */
  public async tokenGenerate(analysisID: GenericID): Promise<{ analysis_token: string }> {
    const result = await this.doRequest<{ analysis_token: string }>({
      path: `/analysis/${analysisID}/token`,
      method: "GET",
    });

    return result;
  }

  /**
   * @description Uploads a script file to an analysis.
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/analysis} Analysis
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.analysis.uploadScript("analysis-id-123", {
   *   name: "script.js",
   *   content: "base64-encoded-content",
   *   language: "node"
   * });
   * console.log(result);
   * ```
   */
  public async uploadScript(analysisID: GenericID, fileObj: ScriptFile): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/analysis/${analysisID}/upload`,
      method: "POST",
      body: {
        file: fileObj.content,
        file_name: fileObj.name,
        language: fileObj.language,
      },
    });

    return result;
  }

  /**
   * @description Gets a download URL for the analysis script.
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/analysis} Analysis
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const download = await Resources.analysis.downloadScript("analysis-id-123", {
   *   version: 1
   * });
   * console.log(download.url);
   * ```
   */
  public async downloadScript(
    analysisID: GenericID,
    options?: { version?: number }
  ): Promise<{ url: string; size_unit: string; size: number; expire_at: Date }> {
    const { version } = options || {};

    let result = await this.doRequest<{ url: string; size_unit: string; size: number; expire_at: Date }>({
      path: `/analysis/${analysisID}/download`,
      method: "GET",
      params: {
        ...(version && { version }),
      },
    });
    result = dateParser(result, ["expire_at"]);

    return result;
  }
}

export default Analyses;
