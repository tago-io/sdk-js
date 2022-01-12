import FormData from "form-data";
import { GenericID } from "../../common/common.types";
import sleep from "../../common/sleep";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { Base64File, CopyFiles, FileListInfo, FileQuery, FilesPermission, MoveFiles, Options } from "./files.types";

class Files extends TagoIOModule<GenericModuleParams> {
  /**
   * list of files in account
   * @param queryObj Object with path, pagination and quantity
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
   * Upload an array of files(Base64) to TagoIO
   * The filename parameter is also full path
   * @param fileList Array of files data to be uploaded
   * @example
   * ```json
   * fileList: [
   *   {
   *     filename: "/myfiles/myfile.ext",
   *     file: "StringWithBase64"
   *   }
   * ]
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
   * Move/Rename Files
   * @param fileList Array move actions to be made
   * @example
   * ```json
   * fileList: [
   *   {
   *     from: "/myfiles/myOldName.ext",
   *     to: "/myfiles/newFolder/andNewName.ext"
   *   }
   * ]
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
   * Copy Files
   * @param fileList Array of copy actions to be made
   * @example
   * ```json
   * fileList: [
   *   {
   *     from: "/myfiles/myOldName.ext",
   *     to: "/myfiles/newFolder/andNewName.ext"
   *   }
   * ]
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
   * Delete Folder or Files
   * @param files An array of files or folders to be deleted
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
   * Check if file is private or public
   * @param file Path of file
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
   * Change visibility from files
   * @param filesVisibility An Array with files and their visibility to be setted
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
   * Get a file url with authenticate token valid for 120 seconds
   * @param url Full TagoIO File url
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
   * Get file md5 with authenticate token for privates files
   * @param url Full TagoIO File url
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
  private async createMultipartUpload(filename: string, options?: Options) {
    const path =
      options?.dashboard && options?.widget ? `/data/files/${options.dashboard}/${options.widget}` : `/files`;

    const result = await this.doRequest<any>({
      path,
      method: "POST",
      body: {
        multipart_action: "start",
        filename,
        public: options?.isPublic,
        contentType: options?.contentType,
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
  async _uploadPart(filename: string, uploadID: string, partNumber: number, blob: Buffer | Blob, options?: Options) {
    const path =
      options?.dashboard && options?.widget ? `/data/files/${options.dashboard}/${options.widget}` : `/files`;

    const form = new FormData();
    form.append("filename", filename);
    form.append("upload_id", uploadID);
    form.append("part", String(partNumber));
    form.append("file", blob, filename);
    form.append("multipart_action", "upload");

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
  async _addToQueue(filename: string, uploadID: GenericID, partNumber: number, blob: Buffer | Blob, options?: Options) {
    const maxTries = options?.maxTriesForEachChunk || 5;
    const timeout = options?.timeoutForEachFailedChunk || 2000;

    let tries = 0;

    while (tries < maxTries) {
      try {
        const result = await this._uploadPart(filename, uploadID, partNumber, blob, options);
        return result;
      } catch (ex) {
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
    options?: Options
  ) {
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
      },
    });

    return result;
  }

  /**
   * Uploads a single file to TagoIO.
   * The upload is multipart, meaning that the file will be divided and sent in chunks, resulting in multiple requests being made.
   *
   * @param file the file to be uploaded
   * @param filename the path + filename for the file
   * @param options the upload options for this file
   */
  public async uploadFile(file: Buffer | Blob, filename: string, options?: Options) {
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
        return this._completeMultipartUpload(filename, uploadID, parts, options);
      } catch (ex) {
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

export default Files;
