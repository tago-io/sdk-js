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
   * @description Lists all dictionaries from your application with pagination support.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/487-dictionaries} Dictionaries
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const list = await Resources.dictionaries.list({
   *   page: 1,
   *   fields: ["id", "name", "slug"],
   *   amount: 10,
   *   orderBy: ["name", "asc"]
   * });
   * console.log(list);
   * ```
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
   * @description Creates a new dictionary in your application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/489-using-dictionaries-multi-language} Using Dictionaries (Multi-Language)
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.dictionaries.create({
   *   name: "My Dictionary",
   *   slug: "my-dictionary",
   * });
   * console.log(result.dictionary);
   * ```
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
   * @description Modifies an existing dictionary's properties.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/489-using-dictionaries-multi-language} Using Dictionaries (Multi-Language)
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.dictionaries.edit("dictionary-id-123", {
   *   name: "Updated Dictionary",
   * });
   * console.log(result);
   * ```
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
   * @description Deletes a dictionary from your application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/489-using-dictionaries-multi-language} Using Dictionaries (Multi-Language)
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.dictionaries.delete("dictionary-id-123");
   * console.log(result);
   * ```
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
   * @description Retrieves detailed information about a specific dictionary.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/487-dictionaries} Dictionaries
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const info = await Resources.dictionaries.info("dictionary-id-123");
   * console.log(info);
   * ```
   */
  public async info(dictionaryID: GenericID): Promise<DictionaryInfo> {
    let result = await this.doRequest<DictionaryInfo>({
      path: `/dictionary/${dictionaryID}`,
      method: "GET",
    });
    result = dateParser(result, ["created_at", "updated_at"]);

    return result;
  }

  /**
   * @description Edits a language's content in a dictionary.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/489-using-dictionaries-multi-language} Using Dictionaries (Multi-Language)
   *
   * @example
   *  If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.dictionaries.languageEdit("dictionary-id-123", "en-US", {
   *   content: { greeting: "Hello" },
   *   active: true
   * });
   * console.log(result);
   * ```
   */
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
   * @description Removes a language from a dictionary.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/489-using-dictionaries-multi-language} Using Dictionaries (Multi-Language)
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.dictionaries.languageDelete("dictionary-id-123", "en-US");
   * console.log(result);
   * ```
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
   * @description Retrieves language-specific content from a dictionary by ID.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/487-dictionaries} Dictionaries
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const content = await Resources.dictionaries.languageInfo("dictionary-id-123", "en-US", {
   *   fallback: true
   * });
   * console.log(content);
   * ```
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
   * @description Retrieves language-specific content from a dictionary by its slug.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/487-dictionaries} Dictionaries
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const content = await Resources.dictionaries.languageInfoBySlug("SLUG", "en-US", {
   *   fallback: true
   * });
   * console.log(content);
   * ```
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
