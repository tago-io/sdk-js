import { ExportOption, GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
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
  list(queryObj?: BucketQuery): Promise<BucketInfo[]> {
    const result = this.doRequest<BucketInfo[]>({
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

    return result;
  }

  /**
   * Generates and retrieves a new bucket for the account
   * @param bucketObj Object with data to create new bucket
   */
  create(bucketObj: BucketCreateInfo): Promise<{ bucket: string }> {
    const result = this.doRequest<{ bucket: string }>({
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
  edit(bucketID: GenericID, bucketObj: Partial<BucketCreateInfo>): Promise<string> {
    const result = this.doRequest<string>({
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
  delete(bucketID: GenericID): Promise<string> {
    const result = this.doRequest<string>({
      path: `/bucket/${bucketID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Gets information about the bucket
   * @param bucketID Bucket ID
   */
  info(bucketID: GenericID): Promise<BucketInfo> {
    const result = this.doRequest<BucketInfo>({
      path: `/bucket/${bucketID}`,
      method: "GET",
    });

    return result;
  }

  /**
   * Get Amount of data on the Bucket
   * @param bucketID Bucket ID
   */
  amount(bucketID: GenericID): Promise<number> {
    const result = this.doRequest<number>({
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
  listVariables(bucketID: GenericID, optionsObj?: ListVariablesOptions): Promise<VariablesInfo[]> {
    const result = this.doRequest<VariablesInfo[]>({
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
  deleteVariable(bucketID: GenericID, deleteParams: { variable: string; origin: string }): Promise<string> {
    const result = this.doRequest<string>({
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
  getDevicesAssociated(bucketID: GenericID): Promise<BucketDeviceInfo[]> {
    const result = this.doRequest<BucketDeviceInfo[]>({
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
  exportData(buckets: ExportBucket, output: ExportOption, optionsObj?: ExportBucketOption): Promise<string> {
    const result = this.doRequest<string>({
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
