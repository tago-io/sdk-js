import { GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";

import { DictionaryCreateInfo, DictionaryInfo, DictionaryQuery, LanguageData } from "./dictionaries.types";

class Dictionaries extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list with all dictionaries from an account.
   *
   * @default
   * ```json
   * queryObj: {
   *   page: 1,
   *   fields: ["id", "name"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "name,asc",
   * }
   * ```
   *
   * @param queryObj Search query params
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
   * Generates and retrieves a new dictionary for the account
   * @param dictionaryObj Object with data to create new dictionary
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
   * Modifies any property of a dictionary.
   * @param dictionaryID Dictionary ID
   * @param dictionaryObj Dictionary Object data to be replaced
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
   * Deletes a dictionary from the account.
   * @param dictionaryID Dictionary ID
   */
  public async delete(dictionaryID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/dictionary/${dictionaryID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Gets information about a dictionary.
   * @param dictionaryID Dictionary ID
   */
  public async info(dictionaryID: GenericID): Promise<DictionaryInfo> {
    let result = await this.doRequest<DictionaryInfo>({
      path: `/dictionary/${dictionaryID}`,
      method: "GET",
    });
    result = dateParser(result, ["created_at", "updated_at"]);

    return result;
  }

  public async languageEdit(dictionaryID: GenericID, locale: string, languageObj: LanguageData): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/dictionary/${dictionaryID}/${locale}`,
      method: "PUT",
      body: languageObj,
    });

    return result;
  }

  /**
   * Gets information about a dictionary.
   * @param dictionaryID Dictionary ID
   * @param locale Locale string (e.g. `en-US`)
   */
  public async languageInfo(dictionaryID: GenericID, locale: string): Promise<LanguageData> {
    const result = await this.doRequest<LanguageData>({
      path: `/dictionary/${dictionaryID}/${locale}`,
      method: "GET",
    });

    return result;
  }

  /**
   * Gets information about a dictionary.
   * @param dictionaryID Dictionary ID
   * @param locale Locale string (e.g. `en-US`)
   */
  public async languageInfoBySlug(profileId: string, slug: string, locale: string): Promise<LanguageData> {
    const result = await this.doRequest<LanguageData>({
      path: `/dictionary/${profileId}/${slug}/${locale}`,
      method: "GET",
    });

    return result;
  }
}

export default Dictionaries;
