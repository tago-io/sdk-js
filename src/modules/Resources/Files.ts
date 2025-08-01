import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule.ts";
import type { GenericID } from "../../common/common.types";
import sleep from "../../common/sleep.ts";
import dateParser from "../Utils/dateParser.ts";
import type {
  Base64File,
  CopyFiles,
  FileListInfo,
  FileQuery,
  FilesPermission,
  MoveFiles,
  UploadOptions,
} from "./files.types";

type BuildFormDataOptions = {
  filename: string;
  isPublic: boolean | undefined;
  fieldID: string | undefined;
} & (
  | {
      action: "start";
      contentType: string;
    }
  | {
      action: "upload";
      uploadID: string;
      fileBlob: Blob;
      part: number;
    }
);

class Files extends TagoIOModule<GenericModuleParams> {
  /**
   * Lists all files in the application with pagination support.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/127-files} Files
   *
   * @example
   * If receive an error "Authorization Denied", check policy **File** / **Access** in Access Management.
   * ```typescript
   * const result = await Resources.files.list({
   *   path: "/my/folder",
   *   quantity: 100
   * });
   * console.log(result); // { total: 200, usage: 0.05, files: [ { size: 7812, ...} ], folders: [ 'my-folder' ] }
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
   * @see {@link https://help.tago.io/portal/en/kb/articles/140-uploading-files} Uploading Files
   *
   * @example
   * If receive an error "Authorization Denied", check policy **File** / **Upload** in Access Management.
   * ```typescript
   * const result = await Resources.files.uploadBase64([{
   *   filename: "/my-files/document.pdf",
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
   * @see {@link https://help.tago.io/portal/en/kb/articles/127-files} Files
   * @see {@link https://help.tago.io/portal/en/kb/articles/140-uploading-files} Uploading Files
   *
   * @example
   * If receive an error "Authorization Denied", check policy **File** / **Edit** in Access Management.
   * ```typescript
   * const result = await Resources.files.move([{
   *   from: "/old/path/file.txt",
   *   to: "/new/path/renamed.txt"
   * }]);
   * console.log(result); // Successfully Updated

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
   * @see {@link https://help.tago.io/portal/en/kb/articles/127-files} Files
   * @see {@link https://help.tago.io/portal/en/kb/articles/140-uploading-files} Uploading Files
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.files.copy([{
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
   * @see {@link https://help.tago.io/portal/en/kb/articles/127-files} Files
   * @see {@link https://help.tago.io/portal/en/kb/articles/140-uploading-files} Uploading Files
   *
   * @example
   * If receive an error "Authorization Denied", check policy **File** / **Upload** in Access Management.
   * ```typescript
   * const result = await Resources.files.delete([
   *   "/path/to/file.txt",
   *   "/folder/to/delete"
   * ]);
   * console.log(result); // Successfully Removed
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
   * @see {@link https://help.tago.io/portal/en/kb/articles/127-files} Files
   * @see {@link https://help.tago.io/portal/en/kb/articles/140-uploading-files} Uploading Files
   *
   * @example
   * If receive an error "Authorization Denied", check policy **File** / **Access** in Access Management.
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
   * @see {@link https://help.tago.io/portal/en/kb/articles/127-files} Files
   * @see {@link https://help.tago.io/portal/en/kb/articles/140-uploading-files} Uploading Files
   *
   * @example
   * If receive an error "Authorization Denied", check policy **File** / **Edit** in Access Management.
   * ```typescript
   * const result = await Resources.files.changePermission([{
   *   file: "/path/to/file.txt",
   *   public: true
   * }]);
   * console.log(result); // Successfully Updated
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

  private async getPathFromUrl(rawURL: string): Promise<string> {
    const urlString = rawURL.trim();

    try {
      const url = new URL(urlString);

      if (url.protocol !== "https:" && url.protocol !== "http:") {
        return Promise.reject(`${urlString} uses an invalid protocol for TagoIO Files`);
      }

      if (!url.pathname.startsWith("/file/")) {
        return Promise.reject(`${urlString} uses an invalid path for TagoIO Files`);
      }

      return url.pathname;
    } catch {
      return Promise.reject(`${urlString} is not a valid URL for TagoIO Files`);
    }
  }

  /**
   * Gets a signed URL with temporary authentication token.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/127-files} Files
   * @see {@link https://help.tago.io/portal/en/kb/articles/140-uploading-files} Uploading Files
   *
   * @example
   * If receive an error "Authorization Denied", check policy **File** / **Access** in Access Management.
   * ```typescript
   * const signedUrl = await Resources.files.getFileURLSigned("https://api.tago.io/file/...");
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
   * @see {@link https://help.tago.io/portal/en/kb/articles/127-files} Files
   * @see {@link https://help.tago.io/portal/en/kb/articles/140-uploading-files} Uploading Files
   *
   * @example
   * If receive an error "Authorization Denied", check policy **File** / **Access** in Access Management
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
   * Build the `FormData` object to be used in multipart form uploads.
   */
  private buildFormData(options: BuildFormDataOptions): FormData {
    const { action, filename, isPublic, fieldID } = options;
    const formData = new FormData();

    formData.append("multipart_action", action);
    formData.append("filename", filename);

    if (isPublic !== undefined) {
      formData.append("public", JSON.stringify(isPublic));
    }

    if (fieldID) {
      formData.append("field_id", fieldID);
    }

    if (action === "start" && options.contentType) {
      formData.append("contentType", options.contentType);
    }

    if (action === "upload") {
      formData.append("upload_id", options.uploadID);
      formData.append("part", String(options.part));
      formData.append("file", options.fileBlob, filename);
    }

    return formData;
  }

  /**
   * Creates a multipart upload instance
   */
  private async createMultipartUpload(filename: string, options?: UploadOptions) {
    const { dashboard, widget, fieldId: fieldID, isPublic, contentType } = options || {};

    const path = dashboard && widget ? `/data/files/${dashboard}/${widget}` : "/files";

    const formData = this.buildFormData({
      action: "start",
      filename,
      fieldID,
      isPublic,
      contentType,
    });

    const result = await this.doRequest<any>({
      path,
      method: "POST",
      params: {
        ...(options?.blueprint_devices?.length > 0 && {
          blueprint_devices: options.blueprint_devices,
        }),
      },
      body: formData,
    });

    return result;
  }

  /**
   * Uploads a single part to TagoIO
   */
  async _uploadPart(
    filename: string,
    uploadID: string,
    part: number,
    fileBlob: Blob,
    options?: UploadOptions
  ): Promise<{ ETag: string; PartNumber: number }> {
    const { fieldId: fieldID, isPublic } = options || {};
    const path =
      options?.dashboard && options?.widget ? `/data/files/${options.dashboard}/${options.widget}` : "/files";

    const formData = this.buildFormData({
      action: "upload",
      filename,
      fieldID,
      isPublic,
      uploadID,
      fileBlob,
      part,
    });

    const result = await this.doRequest<{ ETag: string }>({
      path,
      method: "POST",
      params: {
        ...(options?.blueprint_devices?.length > 0 && {
          blueprint_devices: options.blueprint_devices,
        }),
      },
      body: formData,
      maxContentLength: Number.POSITIVE_INFINITY,
    });

    return {
      ETag: result.ETag,
      PartNumber: part,
    };
  }

  /**
   * Adds an upload to the queue.
   * It will try to upload for 'opts.maxTriesForEachChunk' and fail
   * if it couldn't upload after those many tries.
   */
  async _addToQueue(
    filename: string,
    uploadID: GenericID,
    partNumber: number,
    blob: Blob,
    options?: UploadOptions
  ): Promise<{ ETag: string; PartNumber: number }> {
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
   */
  async _completeMultipartUpload(
    filename: string,
    uploadID: string,
    parts: { ETag: string; PartNumber: number }[],
    options?: UploadOptions
  ): Promise<{ file: string }> {
    const { fieldId: fieldID, isPublic } = options || {};
    const path =
      options?.dashboard && options?.widget ? `/data/files/${options.dashboard}/${options.widget}` : "/files";

    const partsOrdered = parts.sort((a, b) => a.PartNumber - b.PartNumber);

    const result = await this.doRequest<{ file: string }>({
      path,
      method: "POST",
      params: {
        ...(options?.blueprint_devices?.length > 0 && {
          blueprint_devices: options.blueprint_devices,
        }),
      },
      body: {
        multipart_action: "end",
        filename,
        field_id: fieldID,
        public: isPublic,
        upload_id: uploadID,
        parts: partsOrdered,
      },
    });

    return result;
  }

  /**
   * Uploads a single file to TagoIO using multipart upload.
   * The file is divided into chunks and uploaded in parallel for better performance.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/127-files} Files
   * @see {@link https://help.tago.io/portal/en/kb/articles/140-uploading-files} Uploading Files
   *
   * @example
   * If receive an error "Authorization Denied", check policy **File** / **Upload** in Access Management.
   * ```typescript
   * const file = Buffer.from("file content");
   * const result = await Resources.files.uploadFile(file, "/uploads/myfile.txt", {
   *   chunkSize: 5 * 1024 * 1024, // 5MB chunks
   *   onProgress: (progress) => console.log(`Upload progress: ${progress}%`)
   * });
   * console.log(result.file); // https://api.tago.io/file/.../uploads/myfile.txt
   * ```
   */
  public async uploadFile(file: Blob | Buffer, filename: string, options?: UploadOptions): Promise<{ file: string }> {
    const MB = 2 ** 20;

    let cancelled = false;
    if (options?.onCancelToken) {
      options.onCancelToken(() => {
        cancelled = true;
      });
    }

    this.isCanceled(cancelled);

    const uploadID = await this.createMultipartUpload(filename, options);

    const bytesPerChunk = options?.chunkSize || 7 * MB;
    const fileBlob = file instanceof Blob ? file : new Blob([file]);
    const chunkAmount = Math.floor(fileBlob.size / bytesPerChunk) + 1;
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

    while (offsetStart < fileBlob.size) {
      const sliced = fileBlob.slice(offsetStart, offsetEnd);

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
