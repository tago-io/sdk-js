import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { GenericID } from "../../types";
import dateParser from "../Utils/dateParser";
import { SecretsCreate, SecretsEdit, SecretsInfo, SecretsQuery } from "./secrets.type";

class Secrets extends TagoIOModule<GenericModuleParams> {
  /**
   * @description Retrieves a paginated list of all secrets stored in the profile with filtering and sorting options.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/secrets} Secrets
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const secrets = await Resources.secrets.list({
   *   page: 1,
   *   fields: ["id", "key"],
   *   amount: 20
   * });
   * console.log(secrets);
   * ```
   */
  public async list(queryObj?: SecretsQuery): Promise<SecretsInfo[]> {
    const result = await this.doRequest<SecretsInfo[]>({
      path: "/secrets",
      method: "GET",
      params: {
        page: queryObj?.page || 1,
        fields: queryObj?.fields || ["id", "key"],
        filter: queryObj?.filter || {},
        amount: queryObj?.amount || 20,
        orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "key,asc",
      },
    });

    return result;
  }

  /**
   * @description Retrieves detailed information about a specific secret using its ID.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/secrets} Secrets
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const secretInfo = await Resources.secrets.info("secret-id-123");
   * console.log(secretInfo);
   * ```
   */
  public async info(secretID: GenericID): Promise<SecretsInfo> {
    let result = await this.doRequest<SecretsInfo>({
      path: `/secrets/${secretID}`,
      method: "GET",
    });

    result = dateParser(result, ["created_at", "updated_at"]);

    return result;
  }

  /**
   * @description Creates a new secret in the profile with the specified key and value.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/secrets#Creating_a_Secret} Creating a Secret
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.secrets.create({
   *   key: "API_KEY",
   *   value: "my-secret-value"
   * });
   * console.log(result);
   * ```
   */
  public async create(secretObj: SecretsCreate): Promise<{ id: GenericID }> {
    const result = await this.doRequest<{ id: GenericID }>({
      path: `/secrets`,
      method: "POST",
      body: {
        ...secretObj,
      },
    });

    return result;
  }

  /**
   * @description Modifies the properties of an existing secret.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/secrets} Secrets
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.secrets.edit("secret-id-123", {
   *   key: "UPDATED_API_KEY",
   *   value: "new-secret-value"
   * });
   * console.log(result);
   * ```
   */
  public async edit(secretID: GenericID, secretObj: SecretsEdit): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/secrets/${secretID}`,
      method: "PUT",
      body: {
        ...secretObj,
      },
    });

    return result;
  }

  /**
   * @description Permanently removes a secret from the profile.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/secrets} Secrets
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.secrets.delete("secret-id-123");
   * console.log(result);
   * ```
   */
  public async delete(secretID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/secrets/${secretID}`,
      method: "DELETE",
    });

    return result;
  }
}

export default Secrets;
