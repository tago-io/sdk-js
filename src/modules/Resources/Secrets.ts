import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { GenericID } from "../../types";
import { SecretsInfo, SecretsQuery } from "./secrets.type";

class Secrets extends TagoIOModule<GenericModuleParams> {
	/**
	 * Retrieves a list with all Secrets from the profile
	 * @default
	 * ```json
	 * queryObj: {
	 *   page: 1,
	 *   fields: ["id", "key"],
	 *   filter: {},
	 *   amount: 20,
	 *   orderBy: "key,asc",
	 * }
	 * ```json
	 * @param queryObj Search query params
	 */
	public async list(queryObj?: SecretsQuery): Promise<SecretsInfo[]> {
		const result = await this.doRequest<SecretsInfo[]>({
			path: "/secrets",
			method: "GET",
			params: {
					page: queryObj?.page || 1,
					fields: queryObj?.fields || ["id", "name"],
					filter: queryObj?.filter || {},
					amount: queryObj?.amount || 20,
					orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "name,asc",
			},
		});

		return result;
	}

	/**
   * Gets information about the Secrets
   * @param secretID Secret ID
   */
	public async info(secretID: GenericID): Promise<SecretsInfo> {
		const result = await this.doRequest<SecretsInfo>({
			path: `/secrets/${secretID}`,
			method: "GET",
		});

		return result;
	}

	/**
	 * Create a new secret
	 * @param secretObj data object to create new TagoIO Secret
	 */
	public async create(secretObj: SecretsInfo): Promise<{ id: GenericID }> {
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
	 * Modify any property of the secret.
	 * @param secretID Secret identification
	 * @param secretObj Secret Object with data to replace
	 */
	public async edit(secretID: GenericID, secretObj: Partial<SecretsInfo>): Promise<string> {
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
	 * Deletes a secret from the account
	 * @param secretID Secret identification
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