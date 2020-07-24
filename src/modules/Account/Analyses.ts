import { GenericID, GenericToken } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { AnalysisCreateInfo, AnalysisInfo, AnalysisQuery, ScriptFile } from "./analysis.types";

class Analyses extends TagoIOModule<GenericModuleParams> {
  public async list(query?: AnalysisQuery): Promise<AnalysisInfo[]> {
    const result = await this.doRequest<AnalysisInfo[]>({
      path: "/analysis/",
      method: "GET",
      params: {
        page: query?.page || 1,
        fields: query?.fields || ["id", "name"],
        filter: query?.filter || {},
        amount: query?.amount || 20,
        orderBy: query?.orderBy ? `${query.orderBy[0]},${query.orderBy[1]}` : "name,asc",
      },
    });

    return result;
  }

  public async create(data: AnalysisCreateInfo): Promise<{ id: GenericID; token: GenericToken }> {
    const result = await this.doRequest<{ id: GenericID; token: GenericToken }>({
      path: `/analysis`,
      method: "POST",
      body: {
        ...data,
      },
    });

    return result;
  }

  public async edit(analysisID: GenericID, data: Partial<AnalysisInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/analysis/${analysisID}`,
      method: "PUT",
      body: {
        ...data,
      },
    });

    return result;
  }
  public async delete(analysisID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/analysis/${analysisID}`,
      method: "DELETE",
    });

    return result;
  }
  public async info(analysisID: GenericID): Promise<AnalysisInfo> {
    const result = await this.doRequest<AnalysisInfo>({
      path: `/analysis/${analysisID}`,
      method: "GET",
    });

    return result;
  }

  public async run(analysisID: GenericID, scope?: object): Promise<{ analysis_token: GenericToken }> {
    const result = await this.doRequest<{ analysis_token: GenericToken }>({
      path: `/analysis/${analysisID}/run`,
      method: "POST",
      body: {
        scope,
      },
    });

    return result;
  }

  public async tokenGenerate(analysisID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/analysis/${analysisID}/token`,
      method: "GET",
    });

    return result;
  }

  public async uploadScript(analysisID: GenericID, file: ScriptFile): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/analysis/${analysisID}/upload`,
      method: "POST",
      body: {
        file: file.content,
        file_name: file.name,
        language: file.language,
      },
    });

    return result;
  }

  public async downloadScript(
    analysisID: GenericID
  ): Promise<{ url: string; size_unit: string; size: number; expire_at: string }> {
    const result = await this.doRequest<{ url: string; size_unit: string; size: number; expire_at: string }>({
      path: `/analysis/${analysisID}/download`,
      method: "GET",
    });

    return result;
  }
}

export default Analyses;
