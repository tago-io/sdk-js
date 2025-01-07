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
   * @description Lists all files in the application with pagination support.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/127-files} Files
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Uploads base64 encoded files to TagoIO storage.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/140-uploading-files} Uploading Files
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Moves or renames files in TagoIO storage.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/127-files} Files
   * @see {@link https://help.tago.io/portal/en/kb/articles/140-uploading-files} Uploading Files
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Copies files in TagoIO files.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/127-files} Files
   * @see {@link https://help.tago.io/portal/en/kb/articles/140-uploading-files} Uploading Files
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Deletes files or folders from TagoIO storage.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/127-files} Files
   * @see {@link https://help.tago.io/portal/en/kb/articles/140-uploading-files} Uploading Files
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Checks if a file is public or private.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/127-files} Files
   * @see {@link https://help.tago.io/portal/en/kb/articles/140-uploading-files} Uploading Files
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Changes visibility settings for multiple files.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/127-files} Files
   * @see {@link https://help.tago.io/portal/en/kb/articles/140-uploading-files} Uploading Files
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Gets a signed URL with temporary authentication token.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/127-files} Files
   * @see {@link https://help.tago.io/portal/en/kb/articles/140-uploading-files} Uploading Files
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Gets the MD5 hash of a file with authentication for private files.
   * This hash can be used to verify file integrity.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/127-files} Files
   * @see {@link https://help.tago.io/portal/en/kb/articles/140-uploading-files} Uploading Files
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management
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
   * @description Creates a multipart upload instance
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
   * @description Uploads a single part to TagoIO
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
   * @description Adds an upload to the queue.
   * It will try to upload for 'opts.maxTriesForEachChunk' and fail
   * if it couldn't upload after those many tries.
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
   * @description Finishes a multipart upload instance
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
   * @description Uploads a single file to TagoIO using multipart upload.
   * The file is divided into chunks and uploaded in parallel for better performance.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/127-files} Files
   * @see {@link https://help.tago.io/portal/en/kb/articles/140-uploading-files} Uploading Files
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Throw a error if is cancelled
   */
  private isCanceled(cancelled: boolean) {
    if (cancelled) {
      throw new Error("Cancelled request");
    }
  }
}

/**
 * Check if the error returned from the API is a usage limit exceeded error.
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
