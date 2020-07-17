interface FileQuery {
  path?: string;
  paginationToken?: string;
  quantity?: number;
}

interface FileListInfo {
  files: {
    filename: string;
    size: number;
    last_modified: string;
  }[];
  folders: string[];
}

interface Base64File {
  filename: string;
  file: string;
}

interface MoveFiles {
  from: string;
  to: string;
}

interface FilesPermission {
  file: string;
  public: boolean;
}

interface Options {
  maxTriesForEachChunk?: number;
  timeoutForEachFailedChunk?: number;
  contentType?: string;
  isPublic: boolean;
  dashboard?: string;
  widget?: string;
  onCancelToken?: Function;
  chunkSize?: number;
  onProgress: Function;
}
export { FileQuery, FileListInfo, Base64File, MoveFiles, FilesPermission, Options };
