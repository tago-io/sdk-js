import { ExportOption, GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import {
  BucketCreateInfo,
  BucketDeviceInfo,
  BucketInfo,
  BucketQuery,
  ExportBucket,
  ExportBucketOption,
  ListVariablesOptions,
  VariablesInfo,
} from "./buckets.types";

class Buckets extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list with all buckets from account
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
   * @param queryObj Search query params
   */
  public async list(queryObj?: BucketQuery): Promise<BucketInfo[]> {
    let result = await this.doRequest<BucketInfo[]>({
      path: "/bucket",
      method: "GET",
      params: {
        page: queryObj?.page || 1,
        fields: queryObj?.fields || ["id", "name"],
        filter: queryObj?.filter || {},
        amount: queryObj?.amount || 20,
        orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "name,asc",
      },
    });

    result = result.map((data) => dateParser(data, ["created_at", "updated_at"]));

    return result;
  }

  /**
   * Generates and retrieves a new bucket for the account
   * @param bucketObj Object with data to create new bucket
   */
  public async create(bucketObj: BucketCreateInfo): Promise<{ bucket: string }> {
    const result = await this.doRequest<{ bucket: string }>({
      path: "/bucket",
      method: "POST",
      body: bucketObj,
    });

    return result;
  }

  /**
   * Modifies any property of the bucket.
   * @param bucketID Bucket ID
   * @param bucketObj Bucket Object data to be replaced
   */
  public async edit(bucketID: GenericID, bucketObj: Partial<BucketCreateInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/bucket/${bucketID}`,
      method: "PUT",
      body: bucketObj,
    });

    return result;
  }

  /**
   * Deletes a bucket from the account
   * @param bucketID Bucket ID
   */
  public async delete(bucketID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/bucket/${bucketID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Gets information about the bucket
   * @param bucketID Bucket ID
   */
  public async info(bucketID: GenericID): Promise<BucketInfo> {
    let result = await this.doRequest<BucketInfo>({
      path: `/bucket/${bucketID}`,
      method: "GET",
    });
    result = dateParser(result, ["created_at", "updated_at"]);

    return result;
  }

  /**
   * Get Amount of data on the Bucket
   * @param bucketID Bucket ID
   */
  public async amount(bucketID: GenericID): Promise<number> {
    const result = await this.doRequest<number>({
      path: `/bucket/${bucketID}/data_amount`,
      method: "GET",
    });

    return result;
  }

  /**
   * List variables inside the bucket
   * @default
   * ```json
   * optionsObj: {
   *   showAmount: false
   *   showDeleted: false
   *   resolveOriginName: false
   * }
   * ```
   * @param bucketID Bucket ID
   * @param optionsObj Request options
   */
  public async listVariables(bucketID: GenericID, optionsObj?: ListVariablesOptions): Promise<VariablesInfo[]> {
    const result = await this.doRequest<VariablesInfo[]>({
      path: `/bucket/${bucketID}/variable`,
      method: "GET",
      params: {
        amount: optionsObj?.showAmount || false,
        deleted: optionsObj?.showDeleted || false,
        resolveOriginName: optionsObj?.resolveOriginName || false,
      },
    });

    return result;
  }

  /**
   * Delete a bucket variable
   * @param bucketID Bucket ID
   * @param deleteParams Variable Details
   */
  public async deleteVariable(
    bucketID: GenericID,
    deleteParams: { variable: string; origin: string }
  ): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/bucket/${bucketID}/variable`,
      method: "DELETE",
      body: deleteParams || {},
    });

    return result;
  }

  /**
   * Get all device associated with bucket
   * @param bucketID Bucket ID
   */
  public async getDevicesAssociated(bucketID: GenericID): Promise<BucketDeviceInfo[]> {
    const result = await this.doRequest<BucketDeviceInfo[]>({
      path: `/bucket/${bucketID}/device`,
      method: "GET",
    });

    return result;
  }

  /**
   * Export Data from Bucket
   * @param buckets Array of JSON with get details
   * @param output Type of output
   * @param optionsObj Options of request
   */
  public async exportData(
    buckets: ExportBucket,
    output: ExportOption,
    optionsObj?: ExportBucketOption
  ): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/data/export?output=${output}`,
      method: "POST",
      body: {
        buckets,
        ...optionsObj,
      },
    });

    return result;
  }
}

export default Buckets;
