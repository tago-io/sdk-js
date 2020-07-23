import { ExportOption, GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import {
  BucketCreateInfo,
  BucketDeviceInfo,
  BucketInfo,
  BucketQuery,
  ExportBucket,
  ExportBucketOption,
  VariablesInfo,
} from "./buckets.types";

interface ListVariablesOptions {
  /**
   * return amount of each variable
   */
  showAmount?: boolean;
  /**
   * return array of async deleted
   */
  showDeleted?: boolean;
  /**
   * Change origins to array of object with id and name
   */
  resolveOriginName?: boolean;
}

class Buckets extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list with all buckets from account
   * @example
   * Default: {
   *   page: 1,
   *   fields: ["id", "name"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "name,asc",
   * }
   * @param query Search query params
   */
  list(query?: BucketQuery): Promise<BucketInfo[]> {
    const result = this.doRequest<BucketInfo[]>({
      path: "/bucket",
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

  /**
   * Generates and retrieves a new bucket for the account
   * @param createParams Bucket create object
   */
  create(createParams: BucketCreateInfo): Promise<{ bucket: string }> {
    const result = this.doRequest<{ bucket: string }>({
      path: "/bucket",
      method: "POST",
      body: createParams,
    });

    return result;
  }

  /**
   * Modifies any property of the bucket.
   * @param bucketID Bucket ID
   * @param bucketObject JSON of bucket to replace
   */
  edit(bucketID: GenericID, bucketObject: Partial<BucketCreateInfo>): Promise<string> {
    const result = this.doRequest<string>({
      path: `/bucket/${bucketID}`,
      method: "PUT",
      body: bucketObject,
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
   * @example
   * Options Default: {
   *   showAmount: false
   *   showDeleted: false
   *   resolveOriginName: false
   * }
   * @param bucketID Bucket ID
   * @param options Request options
   */
  listVariables(bucketID: GenericID, options?: ListVariablesOptions): Promise<VariablesInfo[]> {
    const result = this.doRequest<VariablesInfo[]>({
      path: `/bucket/${bucketID}/variable`,
      method: "GET",
      params: {
        amount: options?.showAmount || false,
        deleted: options?.showDeleted || false,
        resolveOriginName: options?.resolveOriginName || false,
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
   * @param options Options of request
   */
  exportData(buckets: ExportBucket, output: ExportOption, options?: ExportBucketOption): Promise<string> {
    const result = this.doRequest<string>({
      path: `/data/export?output=${output}`,
      method: "POST",
      body: {
        buckets,
        ...options,
      },
    });

    return result;
  }
}

export default Buckets;
