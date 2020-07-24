import FormData from "form-data";
import { GenericID } from "../../common/common.types";
import sleep from "../../common/sleep";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { Base64File, FileListInfo, FileQuery, FilesPermission, MoveFiles, Options } from "./files.types";

class Files extends TagoIOModule<GenericModuleParams> {
  private isCanceled(cancelled: boolean) {
    if (cancelled) {
      throw new Error("Cancelled request");
    }
  }

  public async list(query?: FileQuery): Promise<FileListInfo> {
    const result = await this.doRequest<FileListInfo>({
      path: "/files",
      method: "GET",
      params: {
        path: query?.path || "/",
        pagination_token: query?.paginationToken,
        qty: query?.quantity || 300,
      },
    });

    return result;
  }

  public async uploadBase64(data: Base64File[]): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/files",
      method: "POST",
      body: data,
    });

    return result;
  }

  public async move(data: MoveFiles[]): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/files",
      method: "PUT",
      body: data,
    });

    return result;
  }

  public async delete(files: string[]): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/files",
      method: "DELETE",
      body: files,
    });

    return result;
  }

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

  public async changePermission(files: FilesPermission[]): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/files/permission",
      method: "PUT",
      body: files,
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

  private async createMultipartUpload(filename: string, options: Options) {
    const path = options.dashboard && options.widget ? `/data/files/${options.dashboard}/${options.widget}` : `/files`;

    const result = await this.doRequest<any>({
      path,
      method: "POST",
      body: {
        multipart_action: "start",
        filename,
        public: options.isPublic,
        contentType: options.contentType,
      },
    });

    return result;
  }

  async _uploadPart(filename: string, uploadID: string, partNumber: number, blob: Buffer | Blob, options: Options) {
    const path = options.dashboard && options.widget ? `/data/files/${options.dashboard}/${options.widget}` : `/files`;

    const form = new FormData();
    form.append("filename", filename);
    form.append("upload_id", uploadID);
    form.append("part", String(partNumber));
    form.append("file", blob as Blob, filename);
    form.append("multipart_action", "upload");

    const headers = { "Content-Type": "multipart/form-data" };

    const result = await this.doRequest<any>({
      path,
      method: "POST",
      body: form,
      headers,
    });

    return {
      ETag: result.ETag,
      PartNumber: partNumber,
    };
  }

  async _addToQueue(filename: string, uploadID: GenericID, partNumber: number, blob: Buffer | Blob, options: Options) {
    const maxTries = options.maxTriesForEachChunk || 5;
    const timeout = options.timeoutForEachFailedChunk || 2000;

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

  async _completeMultipartUpload(filename: string, uploadID: string, parts: any[], options: Options) {
    const path = options.dashboard && options.widget ? `/data/files/${options.dashboard}/${options.widget}` : `/files`;

    const partsOrdered = parts.sort((a, b) => a.PartNumber - b.PartNumber);

    const headers = { "Content-Type": "multipart/form-data" };

    const result = await this.doRequest<any>({
      path,
      method: "POST",
      body: {
        multipart_action: "end",
        upload_id: uploadID,
        filename,
        parts: partsOrdered,
      },
    });
  }

  public async uploadFile(file: Buffer | Blob, filename: string, options: Options) {
    const MB = Math.pow(2, 20);

    let cancelled = false;
    if (options.onCancelToken) {
      options.onCancelToken(() => {
        cancelled = true;
      });
    }

    this.isCanceled(cancelled);

    const uploadID = await this.createMultipartUpload(filename, options);

    const bytesPerChunk = options.chunkSize || 7 * MB;
    const fileSize = (file as Buffer).length || (file as Blob).size;
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

        if (options.onProgress) {
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
}

export default Files;
