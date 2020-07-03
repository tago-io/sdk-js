import TagoIOModule, { GenericModuleParams } from "../../comum/TagoIOModule";
import { GenericID, Query, ExportOption } from "../../comum/comum.types";
import {
  BucketInfo,
  BucketCreateInfo,
  VariablesInfo,
  BucketDeviceInfo,
  ExportBucket,
  ExportBucketOption,
} from "./account.types";

type BucketQuery = Query<BucketInfo, "name" | "visible" | "data_retention" | "created_at" | "updated_at">;

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
   *
   * @param {ListQuery} [query] Search query params;
   * Default:{
   *   page: 1,
   *   fields: ["id", "name"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "name,asc",
   * }
   * @return {Promise<BucketInfo[]>}
   * @memberof Device
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
   *
   * @param {BucketCreateInfo} data New Bucket info
   * @returns {(Promise<{ bucket: string }>)} Bucket created info
   * @memberof Buckets
   */
  create(data: BucketCreateInfo): Promise<{ bucket: string }> {
    const result = this.doRequest<{ bucket: string }>({
      path: "/bucket",
      method: "POST",
      body: data,
    });

    return result;
  }

  /**
   * Modifies any property of the bucket.
   *
   * @param {GenericID} bucketID Bucket identification
   * @param {Partial<BucketCreateInfo>} data Device info to change
   * @returns {Promise<string>} String with status
   * @memberof Buckets
   */
  edit(bucketID: GenericID, data: Partial<BucketCreateInfo>): Promise<string> {
    const result = this.doRequest<string>({
      path: `/bucket/${bucketID}`,
      method: "PUT",
      body: data,
    });

    return result;
  }

  /**
   * Deletes a bucket from the account
   *
   * @param {GenericID} bucketID Bucket identification
   * @returns {Promise<string>} String with status
   * @memberof Buckets
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
   *
   * @param {GenericID} bucketID Bucket identification
   * @returns {(Promise<BucketInfo>)} Bucket info
   * @memberof Buckets
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
   *
   * @param {GenericID} bucketID Bucket identification
   * @returns {(Promise<number>)} Amount of data
   * @memberof Buckets
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
   *
   * @param {GenericID} bucketID Bucket identification
   * @param {ListVariablesOptions} [options] List options;
   * Default: {
   *   showAmount: false
   *   showDeleted: false
   *   resolveOriginName: false
   * }
   * @returns {Promise<VariablesInfo[]>}
   * @memberof Buckets
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
   *
   * @param {GenericID} bucketID Bucket identification
   * @param {{ variable: string; origin: string }} data Variable target info
   * @returns {Promise<string>} String with status
   * @memberof Buckets
   */
  deleteVariable(bucketID: GenericID, data: { variable: string; origin: string }): Promise<string> {
    const result = this.doRequest<string>({
      path: `/bucket/${bucketID}/variable`,
      method: "DELETE",
      body: data || {},
    });

    return result;
  }

  /**
   * Get all device associated with bucket
   *
   * @param {GenericID} bucketID Bucket identification
   * @returns {Promise<BucketDeviceInfo[]>}
   * @memberof Buckets
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
   *
   * @param {ExportBucket} buckets List with buckets and their variables to be exported
   * @param {ExportOption} output Output format
   * @param {ExportBucketOption} [options] extra options
   * @returns {Promise<string>}
   * @memberof Buckets
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
