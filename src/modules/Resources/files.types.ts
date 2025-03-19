interface FileQuery {
  path?: string;
  paginationToken?: string;
  quantity?: number;
}

interface FileListInfo {
  files: {
    filename: string;
    size: number;
    last_modified: Date | null;
  }[];
  folders: string[];
}

interface Base64File {
  /** Name of file */
  filename: string;
  /** String of Base64 */
  file: string;
  /**
   * Make file public
   * default: false
   */
  public?: boolean;
}

interface CopyFiles {
  from: string;
  to: string;
}

interface MoveFiles {
  from: string;
  to: string;
}

interface FilesPermission {
  file: string;
  public: boolean;
}

type UploadOptions = {
  /** the maximum amount of tries to upload each chunk to TagoIO. After this many unsuccessful tries of a single chunk, the upload is aborted */
  maxTriesForEachChunk?: number;
  /** timeout before trying to upload the same chunk if the request failed */
  timeoutForEachFailedChunk?: number;
  /** The file's content type. This is optional */
  contentType?: string;
  /** if the file can be accessed by anybody with a link or not */
  isPublic?: boolean;
  /**
   * Dashboard ID.
   *
   * Uploading files from a widget requires `dashboard`, `widget`, and `fieldId` to be provided.
   */
  dashboard?: string;
  /**
   * Widget ID.
   *
   * Uploading files from a widget requires `dashboard`, `widget`, and `fieldId` to be provided.
   */
  widget?: string;
  /**
   * ID of the field from the widget where the file is selected.
   *
   * Uploading files from a widget requires `dashboard`, `widget`, and `fieldId` to be provided.
   */
  fieldId?: string;
  /** will provide a cancel token for you to cancel the request */
  onCancelToken?: (cancel: () => void) => any;
  /** the byte size of each chunk sent to TagoIO. This will influence how many requests this function will perform */
  chunkSize?: number;
  /** will provide the upload percentage for this file */
  onProgress?: (percentage: number) => any;
};

export { FileQuery, FileListInfo, Base64File, MoveFiles, FilesPermission, UploadOptions, CopyFiles };
