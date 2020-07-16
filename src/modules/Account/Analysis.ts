import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { GenericID, Query, TokenCreateResponse, GenericToken, Base64 } from "../../common/comum.types";
import { AnalysisCreateInfo, AnalysisInfo, ScriptFile } from "./account.types";

type ConnectorQuery = Query<AnalysisInfo, "name" | "active" | "run_on" | "last_run" | "created_at" | "updated_at">;

class Analysis extends TagoIOModule<GenericModuleParams> {
  public async list(query?: ConnectorQuery): Promise<AnalysisInfo[]> {
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

  public async edit(analisysID: GenericID, data: Partial<AnalysisInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/analysis/${analisysID}`,
      method: "PUT",
      body: {
        ...data,
      },
    });

    return result;
  }
  public async delete(analisysID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/analysis/${analisysID}`,
      method: "DELETE",
    });

    return result;
  }
  public async info(analisysID: GenericID): Promise<AnalysisInfo> {
    const result = await this.doRequest<AnalysisInfo>({
      path: `/analysis/${analisysID}`,
      method: "GET",
    });

    return result;
  }

  public async run(analisysID: GenericID, scope?: object): Promise<{ analysis_token: GenericToken }> {
    const result = await this.doRequest<{ analysis_token: GenericToken }>({
      path: `/analysis/${analisysID}/run`,
      method: "POST",
      body: {
        scope,
      },
    });

    return result;
  }

  public async tokenGenerate(analisysID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/analysis/${analisysID}/token`,
      method: "GET",
    });

    return result;
  }

  public async uploadScript(analisysID: GenericID, file: ScriptFile): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/analysis/${analisysID}/upload`,
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
    analisysID: GenericID
  ): Promise<{ url: string; size_unit: string; size: number; expire_at: string }> {
    const result = await this.doRequest<{ url: string; size_unit: string; size: number; expire_at: string }>({
      path: `/analysis/${analisysID}/download`,
      method: "GET",
    });

    return result;
  }
}

export default Analysis;
