import type { GenericID, GenericToken } from "../../common/common.types.ts";
import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule.ts";
import { withTimeout } from "../../infrastructure/fetchUtils.ts";
import dateParser from "../Utils/dateParser.ts";
import type {
  AnalysisCreateInfo,
  AnalysisInfo,
  AnalysisListItem,
  AnalysisQuery,
  ScriptFile,
  SnippetRuntime,
  SnippetsListResponse,
} from "./analysis.types.ts";

/**
 * Base URL for TagoIO analysis snippets repository
 */
const SNIPPETS_BASE_URL = "https://snippets.tago.io";

class Analyses extends TagoIOModule<GenericModuleParams> {
  /**
   * Lists all analyses from the application with pagination support.
   * Use this to retrieve and manage analyses in your application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/analysis} Analysis
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Analysis** / **Access** in Access Management.
   * ```typescript
   * const list = await Resources.analysis.list({
   *   page: 1,
   *   fields: ["id", "name"],
   *   amount: 10,
   *   orderBy: ["name", "asc"]
   * });
   * console.log(list); // [ { id: 'analysis-id-123', name: 'Analysis Test', ...} ]
   * ```
   */
  public async list<T extends AnalysisQuery>(
    queryObj?: T
  ): Promise<
    AnalysisListItem<
      T["fields"] extends AnalysisQuery["fields"]
        ? T["fields"] extends readonly (keyof any)[]
          ? T["fields"][number]
          : "id" | "name"
        : "id" | "name"
    >[]
  > {
    let result = await this.doRequest<
      AnalysisListItem<
        T["fields"] extends AnalysisQuery["fields"]
          ? T["fields"] extends readonly (keyof any)[]
            ? T["fields"][number]
            : "id" | "name"
          : "id" | "name"
      >[]
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
   * Creates a new analysis in your application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/120-creating-analysis} Creating Analysis
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Analysis** / **Create** in Access Management.
   * ```typescript
   * const newAnalysis = await Resources.analysis.create({
   *   name: "My Analysis",
   *   type: "node",
   *   tags: [{ key: "type", value: "data-processing" }]
   * });
   * console.log(newAnalysis.id, newAnalysis.token); // analysis-id-123, analysis-token-123
   * ```
   */
  public async create(analysisObj: AnalysisCreateInfo): Promise<{ id: GenericID; token: GenericToken }> {
    const result = await this.doRequest<{ id: GenericID; token: GenericToken }>({
      path: "/analysis",
      method: "POST",
      body: {
        ...analysisObj,
      },
    });

    return result;
  }

  /**
   * Modifies an existing analysis.
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/analysis} Analysis
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Analysis** / **Create** in Access Management.
   * ```typescript
   * const result = await Resources.analysis.edit("analysis-id-123", {
   *   name: "Updated Analysis",
   *   active: false
   * });
   * console.log(result); // Successfully Updated
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
   * Deletes an analysis from your application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/analysis} Analysis
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Analysis** / **Delete** in Access Management.
   * ```typescript
   * const result = await Resources.analysis.delete("analysis-id-123");
   * console.log(result); // Successfully Removed
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
   * Retrieves detailed information about a specific analysis.
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/analysis} Analysis
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Analysis** / **Access** in Access Management.
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
   * Executes an analysis with optional scope parameters.
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/analysis} Analysis
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Analysis** / **Run Analysis** in Access Management.
   * ```typescript
   * const result = await Resources.analysis.run("analysis-id-123", { environment: "production" });
   * console.log(result.analysis_token);
   * ```
   */
  public async run(analysisID: GenericID, scopeObj?: Record<string, any>): Promise<{ analysis_token: GenericToken }> {
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
   * Generates a new token for the analysis.
   * @remarks **This is only allowed when the analysis is running in external mode.**
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/analysis} Analysis
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const token = await resources.analysis.tokenGenerate("analysis-id-123");
   * console.log(token.analysis_token); // analysis-token-123
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
   * Uploads a script file to an analysis.
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/analysis} Analysis
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Analysis** / **Upload Analysis Script** in Access Management.
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
   * Gets a download URL for the analysis script.
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/analysis} Analysis
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Analysis** / **Download Analysis Script** in Access Management.
   * ```typescript
   * const download = await Resources.analysis.downloadScript("analysis-id-123", { version: 1 });
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

  /**
   * Get all available snippets for a specific runtime environment.
   * Fetches analysis code snippets from the public TagoIO snippets repository.
   *
   * @param runtime - The runtime environment to get snippets for
   * @returns Promise resolving to the snippets metadata
   *
   * @example
   * ```typescript
   * const denoSnippets = await Resources.analysis.listSnippets("deno-2025-08-01");
   *
   * // Print all snippet titles
   * denoSnippets.snippets.forEach(snippet => {
   *   console.log(`${snippet.title}: ${snippet.description}`);
   * });
   * ```
   */
  public async listSnippets(runtime: SnippetRuntime): Promise<SnippetsListResponse> {
    const url = `${SNIPPETS_BASE_URL}/${runtime}.json`;
    const enhancedFetch = withTimeout(fetch, 10000);

    const response = await enhancedFetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch snippets: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as SnippetsListResponse;
  }

  /**
   * Get the raw source code content of a specific snippet file.
   * Fetches the actual code content from the TagoIO snippets repository.
   *
   * @param runtime - The runtime environment the snippet belongs to
   * @param filename - The filename of the snippet to retrieve
   * @returns Promise resolving to the raw file content as string
   *
   * @example
   * ```typescript
   * // Get TypeScript code for console example
   * const code = await Resources.analysis.getSnippetFile("deno-2025-08-01", "console.ts");
   * console.log(code);
   *
   * // Get Python code for data processing
   * const pythonCode = await Resources.analysis.getSnippetFile("python-2025-08-01", "avg-min-max.py");
   * console.log(pythonCode);
   * ```
   */
  public async getSnippetFile(runtime: SnippetRuntime, filename: string): Promise<string> {
    const url = `${SNIPPETS_BASE_URL}/${runtime}/${filename}`;
    const enhancedFetch = withTimeout(fetch, 10000);

    const response = await enhancedFetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch snippet file: ${response.status} ${response.statusText}`);
    }

    const content = await response.text();
    return content;
  }
}

export default Analyses;
