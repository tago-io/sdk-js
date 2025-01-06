import FormData from "form-data";
import { GenericID } from "../../common/common.types";
import sleep from "../../common/sleep";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import {
  Base64File,
  CopyFiles,
  FileListInfo,
  FileQuery,
  FilesPermission,
  MoveFiles,
  UploadOptions,
} from "./files.types";

class Files extends TagoIOModule<GenericModuleParams> {
  /**
   * Lists all files in the application with pagination support.
   *
   * @param {FileQuery} queryObj - Query parameters for filtering and pagination
   * @param {string} queryObj.path - Path to list files from
   * @param {string} queryObj.paginationToken - Token for pagination
   * @param {number} queryObj.quantity - Number of items per page
   * @returns {Promise<FileListInfo>} List of files and pagination info
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const files = await Resources.files.list({
   *   path: "/my/folder",
   *   quantity: 100
   * });
   * console.log(files);
   * ```
   */
  public async list(queryObj?: FileQuery): Promise<FileListInfo> {
    const result = await this.doRequest<FileListInfo>({
      path: "/files",
      method: "GET",
      params: {
        path: queryObj?.path || "/",
        pagination_token: queryObj?.paginationToken,
        qty: queryObj?.quantity || 300,
      },
    });

    result.files = result?.files.map((data) => dateParser(data, ["last_modified"]));

    return result;
  }

  /**
   * Uploads base64 encoded files to TagoIO storage.
   *
   * @param {Base64File[]} fileList - Array of files to upload
   * @param {string} fileList[].filename - Full path including filename
   * @param {string} fileList[].file - Base64 encoded file content
   * @returns {Promise<string>} Success message
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.files.uploadBase64([{
   *   filename: "/myfiles/document.pdf",
   *   file: "base64EncodedContent",
   *   public: true,
   * }]);
   * console.log(result);
   * ```
   */
  public async uploadBase64(fileList: Base64File[]): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/files",
      method: "POST",
      body: fileList,
    });

    return result;
  }

  /**
   * Moves or renames files in TagoIO storage.
   *
   * @param {MoveFiles[]} fileList - Array of move operations
   * @param {string} fileList[].from - Source path
   * @param {string} fileList[].to - Destination path
   * @returns {Promise<string>} Success message
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.files.move([{
   *   from: "/old/path/file.txt",
   *   to: "/new/path/renamed.txt"
   * }]);
   * console.log(result);
   * ```
   */
  public async move(fileList: MoveFiles[]): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/files",
      method: "PUT",
      body: fileList,
    });

    return result;
  }

  /**
   * Copies files in TagoIO files.
   *
   * @param {CopyFiles[]} fileList - Array of copy operations
   * @param {string} fileList[].from - Source path
   * @param {string} fileList[].to - Destination path
   * @returns {Promise<string>} Success message
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.files.copy([{
   *   from: "/source/file.txt",
   *   to: "/destination/copy.txt"
   * }]);
   * console.log(result);
   * ```
   */
  public async copy(fileList: CopyFiles[]): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/files/copy",
      method: "PUT",
      body: fileList,
    });

    return result;
  }

  /**
   * Deletes files or folders from TagoIO storage.
   *
   * @param {string[]} files - Array of file/folder paths to delete
   * @returns {Promise<string>} Success message
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.files.delete([
   *   "/path/to/file.txt",
   *   "/folder/to/delete"
   * ]);
   * console.log(result);
   * ```
   */
  public async delete(files: string[]): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/files",
      method: "DELETE",
      body: files,
    });

    return result;
  }

  /**
   * Checks if a file is public or private.
   *
   * @param {string} file - Path to the file
   * @returns {Promise<{public: boolean}>} File permission status
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const permission = await Resources.files.checkPermission("/path/to/file.txt");
   * console.log(permission.public); // true or false
   * ```
   */
  public async checkPermission(file: string): Promise<{ public: boolean }> {
    const result = await this.doRequest<{ public: boolean }>({
      path: "/files/permission",
      method: "GET",
      params: {
        file,
      },
    });

    return result;
  }

  /**
   * Changes visibility settings for multiple files.
   *
   * @param {FilesPermission[]} filesVisibility - Array of file permission configurations
   * @param {string} filesVisibility[].file - Path to the file
   * @param {boolean} filesVisibility[].public - Whether file should be public
   * @returns {Promise<string>} Success message
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.files.changePermission([{
   *   file: "/path/to/file.txt",
   *   public: true
   * }]);
   * console.log(result);
   * ```
   */
  public async changePermission(filesVisibility: FilesPermission[]): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/files/permission",
      method: "PUT",
      body: filesVisibility,
    });

    return result;
  }

  private async getPathFromUrl(url: string): Promise<string> {
    const tagoURL = url.indexOf(".tago.io/file/");

    if (tagoURL === -1) {
      return Promise.reject(`${url} is not a TagoIO files url`);
    }

    return url.slice(tagoURL + 8, url.length);
  }

  /**
   * Gets a signed URL with temporary authentication token.
   *
   * @param {string} url - Full TagoIO file URL
   * @returns {Promise<string>} Signed URL valid for 120 seconds
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const signedUrl = await Resources.files.getFileURLSigned("https://storage.tago.io/file/...");
   * console.log(signedUrl);
   * ```
   */
  public async getFileURLSigned(url: string): Promise<string> {
    const path = await this.getPathFromUrl(url);

    const result = await this.doRequest<string>({
      path,
      method: "GET",
      params: {
        noRedirect: true,
      },
    });

    return result;
  }

  /**
   * Gets the MD5 hash of a file with authentication for private files.
   * This hash can be used to verify file integrity.
   *
   * @param {string} url - Full TagoIO file URL to get MD5 hash
   * @returns {Promise<string>} MD5 hash of the file
   *
   * @example  If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const md5Hash = await Resources.files.getFileMD5("https://storage.tago.io/file/path/document.pdf");
   * console.log(md5Hash); // e.g. "d41d8cd98f00b204e9800998ecf8427e"
   * ```
   */
  public async getFileMD5(url: string): Promise<string> {
    const path = await this.getPathFromUrl(url);

    const result = await this.doRequest<string>({
      path,
      method: "GET",
      params: {
        md5: true,
        noRedirect: true,
      },
    });

    return result;
  }

  /**
   * Creates a multipart upload instance
   * @param filename the path + filename for the file
   * @param options the upload options for this file
   */
  private async createMultipartUpload(filename: string, options?: UploadOptions) {
    const { dashboard, widget, fieldId, isPublic, contentType } = options || {};

    const path = dashboard && widget && fieldId ? `/data/files/${dashboard}/${widget}` : `/files`;

    const result = await this.doRequest<any>({
      path,
      method: "POST",
      body: {
        multipart_action: "start",
        filename,
        public: options?.isPublic,
        contentType,
        ...(fieldId && { field_id: fieldId }),
      },
    });

    return result;
  }

  /**
   * Uploads a single part to TagoIO
   * @param filename the path + filename for the file
   * @param uploadID the upload ID acquired by the 'createMultipartUpload' function call
   * @param partNumber the sequential part number for the upload. This should be 1 in the first call, then 2 in the second call, so on and so forth
   * @param blob the portion of the file to be uploaded
   * @param options the upload options for this file
   */
  async _uploadPart(
    filename: string,
    uploadID: string,
    partNumber: number,
    blob: Buffer | Blob,
    options?: UploadOptions
  ) {
    const { fieldId } = options || {};
    const path =
      options?.dashboard && options?.widget ? `/data/files/${options.dashboard}/${options.widget}` : `/files`;

    const form = new FormData();
    form.append("filename", filename);
    form.append("upload_id", uploadID);
    form.append("part", String(partNumber));
    form.append("file", blob, filename);
    form.append("multipart_action", "upload");

    if (fieldId) {
      form.append("field_id", fieldId);
    }

    let headers: any = { "Content-Type": "multipart/form-data" };
    if (form.getHeaders) {
      headers = form.getHeaders();
    }

    const result = await this.doRequest<{ ETag: string }>({
      path,
      method: "POST",
      body: form,
      maxContentLength: Infinity,
      headers,
    });

    return {
      ETag: result.ETag,
      PartNumber: partNumber,
    };
  }

  /**
   * Adds an upload to the queue.
   * It will try to upload for 'opts.maxTriesForEachChunk' and fail
   * if it couldn't upload after those many tries.
   * @param filename the path + filename for the file
   * @param uploadID the upload ID acquired by the 'createMultipartUpload' function call
   * @param partNumberthe sequential part number for the upload. This should be 1 in the first call, then 2 in the second call, so on and so forth
   * @param blob the portion of the file to be uploaded
   * @param options see the uploadFile function
   */
  async _addToQueue(
    filename: string,
    uploadID: GenericID,
    partNumber: number,
    blob: Buffer | Blob,
    options?: UploadOptions
  ) {
    const maxTries = options?.maxTriesForEachChunk || 5;
    const timeout = options?.timeoutForEachFailedChunk || 2000;

    let tries = 0;

    while (tries < maxTries) {
      try {
        const result = await this._uploadPart(filename, uploadID, partNumber, blob, options);
        return result;
      } catch (ex) {
        if (isLimitError(ex)) {
          throw ex.message;
        }

        await sleep(timeout);

        tries += 1;
        if (tries >= maxTries) {
          throw new Error(`Could not upload part number ${partNumber}: ${ex.message}`);
        }
      }
    }
  }

  /**
   * Finishes a multipart upload instance
   * @param filename the path + filename for the file
   * @param uploadID the upload ID acquired by the 'createMultipartUpload' function call
   * @param parts all the parts uploaded to the file
   * @param options the upload options for this file
   */
  async _completeMultipartUpload(
    filename: string,
    uploadID: string,
    parts: { ETag: String; PartNumber: number }[],
    options?: UploadOptions
  ) {
    const { fieldId } = options || {};
    const path =
      options?.dashboard && options?.widget ? `/data/files/${options.dashboard}/${options.widget}` : `/files`;

    const partsOrdered = parts.sort((a, b) => a.PartNumber - b.PartNumber);

    const headers = { "Content-Type": "multipart/form-data" };

    const result = await this.doRequest<{ file: string }>({
      path,
      method: "POST",
      body: {
        multipart_action: "end",
        upload_id: uploadID,
        filename,
        parts: partsOrdered,
        ...(fieldId && { field_id: fieldId }),
      },
    });

    return result;
  }

  /**
   * Uploads a single file to TagoIO using multipart upload.
   * The file is divided into chunks and uploaded in parallel for better performance.
   *
   * @param {Buffer | Blob} file - The file content to be uploaded
   * @param {string} filename - The path and filename for the file in TagoIO storage
   * @param {UploadOptions} [options] - Upload configuration options
   * @param {number} [options.chunkSize] - Size of each chunk in bytes (min 5MB for multipart)
   * @param {number} [options.maxTriesForEachChunk] - Max retries for failed chunks
   * @param {number} [options.timeoutForEachFailedChunk] - Delay between retries in ms
   * @param {(progress: number) => void} [options.onProgress] - Callback for upload progress (0-100)
   * @param {(cancelFn: () => void) => void} [options.onCancelToken] - Callback to enable upload cancellation
   * @returns {Promise<{file: string}>} Object containing the uploaded file path
   * @throws {Error} When chunk size is invalid or upload fails
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const file = Buffer.from("file content");
   * const result = await Resources.files.uploadFile(file, "/uploads/myfile.txt", {
   *   chunkSize: 5 * 1024 * 1024, // 5MB chunks
   *   onProgress: (progress) => console.log(`Upload progress: ${progress}%`),
   *   onCancelToken: (cancel) => {
   *     // Call cancel() to abort upload
   *   }
   * });
   * console.log(result.file);
   * ```
   */
  public async uploadFile(file: Buffer | Blob, filename: string, options?: UploadOptions) {
    const MB = Math.pow(2, 20);

    let cancelled = false;
    if (options?.onCancelToken) {
      options.onCancelToken(() => {
        cancelled = true;
      });
    }

    this.isCanceled(cancelled);

    const uploadID = await this.createMultipartUpload(filename, options);

    const bytesPerChunk = options?.chunkSize || 7 * MB;
    const fileSize = file instanceof Buffer ? file.length : file.size;
    const chunkAmount = Math.floor(fileSize / bytesPerChunk) + 1;
    const partsPerTime = 3;

    if (chunkAmount > 1 && bytesPerChunk < 5 * MB) {
      throw new Error("Chunk sizes cannot be lower than 5mb if the upload will have multiple parts");
    }

    let offsetStart = 0;
    let offsetEnd = bytesPerChunk;
    let partNumber = 1;
    let error = null;
    const parts: any[] = [];
    const promises: any[] = [];

    this.isCanceled(cancelled);

    while (offsetStart < fileSize) {
      const sliced = file.slice(offsetStart, offsetEnd);

      while (promises.length >= partsPerTime) {
        this.isCanceled(cancelled);

        if (error) {
          throw error;
        }

        await sleep(1000);
      }

      const promise = this._addToQueue(filename, uploadID, partNumber, sliced, options);
      promises.push(promise);

      promise.then((partData: any) => {
        if (promises.indexOf(promise) >= 0) {
          promises.splice(promises.indexOf(promise), 1);
        }

        parts.push(partData);

        if (options?.onProgress) {
          const percentage = (parts.length * 100) / chunkAmount;
          const limitedPercentage = Math.min(percentage, 100).toFixed(2);
          const roundedPercentage = Number(limitedPercentage);
          options.onProgress(roundedPercentage);
        }
      });

      promise.catch((err: Error) => {
        error = err;
      });

      this.isCanceled(cancelled);

      await sleep(500);

      offsetStart = offsetEnd;
      offsetEnd = offsetStart + bytesPerChunk;
      partNumber += 1;
    }

    while (promises.length > 0) {
      this.isCanceled(cancelled);

      if (error) {
        throw error;
      }
      await sleep(1000);
    }

    this.isCanceled(cancelled);

    for (let i = 0; i < 3; i += 1) {
      try {
        return await this._completeMultipartUpload(filename, uploadID, parts, options);
      } catch (ex) {
        if (isLimitError(ex)) {
          throw ex.message;
        }

        await sleep(1000);
        if (i === 2) {
          throw ex;
        }
      }
    }
  }

  /**
   * Throw a error if is cancelled
   * @param cancelled
   */
  private isCanceled(cancelled: boolean) {
    if (cancelled) {
      throw new Error("Cancelled request");
    }
  }
}

/**
 * Check if the error returned from the API is a usage limit exceeded error.
 *
 * @param error Error to check.
 */
function isLimitError(error: any): boolean {
  if (typeof error?.message !== "string") {
    return false;
  }

  const message: string = error?.message;

  // TODO: Use status code instead of string error message when available.
  return message.startsWith("You have exceeded the maximum limit");
}

export default Files;
