import { GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";

import {
  DictionaryCreateInfo,
  DictionaryInfo,
  DictionaryQuery,
  LanguageData,
  LanguageEditData,
  LanguageInfoQuery,
} from "./dictionaries.types";

import { Cache } from "../../modules";

class Dictionaries extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieve a list with all dictionaries from an account.
   *
   * @default
   * ```json
   * queryObj: {
   *   page: 1,
   *   fields: ["id", "name", "slug", "languages"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "name,asc",
   * }
   * ```
   *
   * @param queryObj Search query params.
   */
  public async list(queryObj?: DictionaryQuery): Promise<DictionaryInfo[]> {
    let result = await this.doRequest<DictionaryInfo[]>({
      path: "/dictionary",
      method: "GET",
      params: {
        page: queryObj?.page || 1,
        fields: queryObj?.fields || ["id", "name", "slug", "languages"],
        filter: queryObj?.filter || {},
        amount: queryObj?.amount || 20,
        orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "name,asc",
      },
    });

    result = result.map((data) => dateParser(data, ["created_at", "updated_at"]));

    return result;
  }

  /**
   * Generate a new dictionary for the account.
   *
   * @param dictionaryObj Object with data to create new dictionary.
   */
  public async create(dictionaryObj: DictionaryCreateInfo): Promise<{ dictionary: string }> {
    const result = await this.doRequest<{ dictionary: string }>({
      path: "/dictionary",
      method: "POST",
      body: dictionaryObj,
    });

    return result;
  }

  /**
   * Modify any property of a dictionary.
   *
   * @param dictionaryID Dictionary ID.
   * @param dictionaryObj Dictionary Object data to be replaced.
   */
  public async edit(dictionaryID: GenericID, dictionaryObj: Partial<DictionaryCreateInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/dictionary/${dictionaryID}`,
      method: "PUT",
      body: dictionaryObj,
    });

    return result;
  }

  /**
   * Delete a dictionary from the account.
   *
   * @param dictionaryID Dictionary ID.
   */
  public async delete(dictionaryID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/dictionary/${dictionaryID}`,
      method: "DELETE",
    });

    Cache.clearCache();

    return result;
  }

  /**
   * Get information about a dictionary.
   *
   * @param dictionaryID Dictionary ID.
   */
  public async info(dictionaryID: GenericID): Promise<DictionaryInfo> {
    let result = await this.doRequest<DictionaryInfo>({
      path: `/dictionary/${dictionaryID}`,
      method: "GET",
    });
    result = dateParser(result, ["created_at", "updated_at"]);

    return result;
  }

  public async languageEdit(dictionaryID: GenericID, locale: string, languageObj: LanguageEditData): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/dictionary/${dictionaryID}/${locale}`,
      method: "PUT",
      body: languageObj,
    });

    Cache.clearCache();

    return result;
  }

  /**
   * Delete a language from a dictionary.
   *
   * @param dictionaryID Dictionary ID.
   * @param locale Language locale string (e.g. `en-US`).
   */
  public async languageDelete(dictionaryID: GenericID, locale: string): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/dictionary/${dictionaryID}/${locale}`,
      method: "DELETE",
    });

    Cache.clearCache();

    return result;
  }

  /**
   * Get information about a dictionary by ID.
   *
   * @param dictionaryID Dictionary ID.
   * @param locale Language locale string (e.g. `en-US`).
   * @param queryObj Language info query params.
   */
  public async languageInfo(
    dictionaryID: GenericID,
    locale: string,
    queryObj?: LanguageInfoQuery
  ): Promise<LanguageData> {
    const result = await this.doRequest<LanguageData>({
      path: `/dictionary/${dictionaryID}/${locale}`,
      method: "GET",
      params: {
        // Default to not getting the fallback language info if language is not found
        // as this route is mainly used to edit a dictionary
        fallback: queryObj?.fallback || false,
      },
    });

    return result;
  }

  /**
   * Get information about a dictionary querying by slug instead of the dictionary's ID.
   *
   * @param slug Dictionary slug.
   * @param locale Language locale string (e.g. `en-US`).
   * @param queryObj Language info query params.
   */
  public async languageInfoBySlug(slug: string, locale: string, queryObj?: LanguageInfoQuery): Promise<LanguageData> {
    const result = await this.doRequest<LanguageData>({
      path: `/dictionary/${slug}/${locale}`,
      method: "GET",
      params: {
        // Default to getting the fallback language info if language is not found
        // as this route is mainly used to use the dictionary strings in applications
        fallback: queryObj?.fallback || true,
      },
    });

    return result;
  }
}

export default Dictionaries;
