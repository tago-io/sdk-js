import { GenericID, GenericToken } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { AnalysisCreateInfo, AnalysisInfo, AnalysisQuery, ScriptFile } from "./analysis.types";

class Analyses extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list with all analyses from the account
   * @default
   * ```json
   * queryObj: {
   *   page: 1,
   *   fields: ["id", "name"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "name,asc",
   * }
   * ```json
   * @param queryObj Search query params
   */
  public async list(queryObj?: AnalysisQuery): Promise<AnalysisInfo[]> {
    let result = await this.doRequest<AnalysisInfo[]>({
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
   * Create a new analyze
   * @param analysisObj data object to create new TagoIO Analyze
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
   * Modify any property of the analyze.
   * @param analysisID Analyze identification
   * @param analysisObj Analyze Object with data to replace
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
   * Deletes an analyze from the account
   * @param analysisID Analyze identification
   */
  public async delete(analysisID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/analysis/${analysisID}`,
      method: "DELETE",
    });

    return result;
  }
  /**
   * Gets information about the analyze
   * @param analysisID Analyze identification
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
   * Force analyze to run
   * @param analysisID Analyze identification
   * @param scopeObj simulate scope for analysis
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
   * Generate a new token for the analysis
   * @param analysisID Analyze identification
   */
  public async tokenGenerate(analysisID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/analysis/${analysisID}/token`,
      method: "GET",
    });

    return result;
  }

  /**
   * Upload a file (base64) to Analysis. Automatically erase the old one
   * @param analysisID Analyze identification
   * @param fileObj Object with name, language and content of the file
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
   * Get a url to download the analysis
   * @param analysisID Analyze identification
   */
  public async downloadScript(
    analysisID: GenericID
  ): Promise<{ url: string; size_unit: string; size: number; expire_at: Date }> {
    let result = await this.doRequest<{ url: string; size_unit: string; size: number; expire_at: Date }>({
      path: `/analysis/${analysisID}/download`,
      method: "GET",
    });
    result = dateParser(result, ["expire_at"]);

    return result;
  }
}

export default Analyses;
