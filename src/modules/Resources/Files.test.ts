import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import type { MockInstance } from "vitest";

import Files from "./Files";

const DEFAULT_FILENAME = "test.txt";
const DEFAULT_UPLOAD_ID = "SOME_UPLOAD_ID";

function createMultipartStartHandler(options?: {
  uploadID?: string;
}) {
  const uploadID = options?.uploadID || DEFAULT_UPLOAD_ID;

  return http.post("https://api.tago.io/files", async ({ request }) => {
    const contentType = request.headers.get("content-type");

    // return nothing since this is the start handler
    if (contentType === "application/json") {
      return;
    }

    const clonedRequest = request.clone();
    const formData = await clonedRequest.formData();

    const action = formData.get("multipart_action");
    if (!action) {
      return new HttpResponse("Missing 'multipart_action' in form data", { status: 400 });
    }

    if (action !== "start") {
      return;
    }

    return HttpResponse.json({
      status: true,
      result: uploadID,
    });
  });
}

function createMultipartUploadHandler(options?: {
  expectedUploadID?: string;
}) {
  const expectedUploadID = options?.expectedUploadID || DEFAULT_UPLOAD_ID;

  return http.post("https://api.tago.io/files", async ({ request }) => {
    const contentType = request.headers.get("content-type");

    // return nothing since this is the upload handler
    if (contentType === "application/json") {
      return;
    }

    const clonedRequest = request.clone();
    const formData = await clonedRequest.formData();

    const action = formData.get("multipart_action");
    if (!action) {
      return new HttpResponse("Missing 'multipart_action' in form data", { status: 400 });
    }

    if (action !== "upload") {
      return;
    }

    const uploadID = formData.get("upload_id");
    const part = formData.get("part");
    if (uploadID !== expectedUploadID) {
      return new HttpResponse(`Mismatched 'upload_id', expected '${expectedUploadID}'`, { status: 400 });
    }

    return HttpResponse.json({
      status: true,
      result: { ETag: `SOME_ETAG_${part}` },
    });
  });
}

function createMultipartEndHandler(options?: {
  expectedFilename?: string;
  expectedParts?: number;
  expectedUploadID?: string;
}) {
  const expectedFilename = options?.expectedFilename || DEFAULT_FILENAME;
  const expectedUploadID = options?.expectedUploadID || DEFAULT_UPLOAD_ID;
  const expectedParts = options?.expectedParts || 1;

  return http.post("https://api.tago.io/files", async ({ request }) => {
    const contentType = request.headers.get("content-type");

    // return nothing since this is the end handler
    if (contentType !== "application/json") {
      return;
    }

    const clonedRequest = request.clone();
    const body = await clonedRequest.json();

    if (body.upload_id !== expectedUploadID) {
      return new HttpResponse(`Mismatched 'upload_id', expected '${expectedUploadID}'`, { status: 400 });
    }

    if (body.filename !== expectedFilename) {
      return new HttpResponse(`Mismatched 'filename', expected ${expectedFilename}`, { status: 400 });
    }

    if (body.parts.length !== expectedParts) {
      return new HttpResponse(`Mismatched amount of 'parts', expected ${expectedParts}`, { status: 400 });
    }

    return HttpResponse.json({
      status: true,
      result: { file: `https://api.tago.io/file/PROFILE_ID/${expectedFilename}` },
    });
  });
}

function createFallthroughHandler() {
  return http.post("https://api.tago.io/files", () => {
    return new HttpResponse("Unknown multipart_action or unhandled test case", { status: 400 });
  });
}

describe("Files", () => {
  const server = setupServer();
  const fallthroughHandler = createFallthroughHandler();

  beforeAll(() => {
    vi.restoreAllMocks();
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it("should handle successful file upload from Buffer", async () => {
    const multipartStartHandler = createMultipartStartHandler();
    const multipartUploadHandler = createMultipartUploadHandler();
    const multipartEndHandler = createMultipartEndHandler({ expectedFilename: "testBuffer.txt" });

    server.use(multipartUploadHandler, multipartStartHandler, multipartEndHandler, fallthroughHandler);

    const resources = new Files({ token: "test-token" });
    const fileBuffer = Buffer.from("test file content");
    const result = await resources.uploadFile(fileBuffer, "testBuffer.txt");

    expect(result.file).toEqual("https://api.tago.io/file/PROFILE_ID/testBuffer.txt");
  });

  it("should handle successful file upload from Blob", async () => {
    const multipartStartHandler = createMultipartStartHandler();
    const multipartUploadHandler = createMultipartUploadHandler();
    const multipartEndHandler = createMultipartEndHandler({ expectedFilename: "testBlob.txt" });

    server.use(multipartUploadHandler, multipartStartHandler, multipartEndHandler, fallthroughHandler);

    const resources = new Files({ token: "test-token" });
    const fileBuffer = Buffer.from("test file content");
    const fileBlob = new Blob([fileBuffer], { type: "text/plain" });
    const result = await resources.uploadFile(fileBlob, "testBlob.txt");

    expect(result.file).toEqual("https://api.tago.io/file/PROFILE_ID/testBlob.txt");
  });
});

describe("Files logic", () => {
  let filesInstance: Files;
  let doRequestSpy: MockInstance;

  const requestBase = {
    method: "GET",
    params: { noRedirect: true },
  };

  const successResponse = {
    status: true,
    result: "signed-url",
  };

  beforeAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    filesInstance = new Files({ token: "test-token" });

    doRequestSpy = vi.spyOn(filesInstance as any, "doRequest");
    doRequestSpy.mockResolvedValue(successResponse);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getFileURLSigned", () => {
    it("calls getPathFromUrl and doRequest for a valid TagoIO URL", async () => {
      const baseURL = "https://api.tago.io";

      const rootPath = "/file/my-test-file.txt";
      const rootResult = await filesInstance.getFileURLSigned(`${baseURL}${rootPath}`);

      expect(doRequestSpy).toHaveBeenCalledTimes(1);
      expect(doRequestSpy).toHaveBeenCalledWith({
        ...requestBase,
        path: rootPath,
      });
      expect(rootResult).toEqual(successResponse);
      doRequestSpy.mockClear();

      const nestedPath = "/file/folder/sub1/sub2/my-test-file.txt";
      const nestedResult = await filesInstance.getFileURLSigned(`${baseURL}${nestedPath}`);

      expect(doRequestSpy).toHaveBeenCalledTimes(1);
      expect(doRequestSpy).toHaveBeenCalledWith({
        ...requestBase,
        path: nestedPath,
      });
      expect(nestedResult).toEqual(successResponse);
    });

    it("calls getPathFromUrl and doRequest for a valid default TagoDeploy URL", async () => {
      const baseURL = "https://api.PROJECT_ID.tagoio.net";

      const rootPath = "/file/my-test-file.txt";
      const rootResult = await filesInstance.getFileURLSigned(`${baseURL}${rootPath}`);

      expect(doRequestSpy).toHaveBeenCalledTimes(1);
      expect(doRequestSpy).toHaveBeenCalledWith({
        ...requestBase,
        path: rootPath,
      });
      expect(rootResult).toEqual(successResponse);
      doRequestSpy.mockClear();

      const nestedPath = "/file/folder/sub1/sub2/my-test-file.txt";
      const nestedResult = await filesInstance.getFileURLSigned(`${baseURL}${nestedPath}`);

      expect(doRequestSpy).toHaveBeenCalledTimes(1);
      expect(doRequestSpy).toHaveBeenCalledWith({
        ...requestBase,
        path: nestedPath,
      });
      expect(nestedResult).toEqual(successResponse);
    });

    it("calls getPathFromUrl and doRequest for a valid custom TagoDeploy URL", async () => {
      const baseURL = "https://api.mytagodeploy.project.com";

      const rootPath = "/file/my-test-file.txt";
      const rootResult = await filesInstance.getFileURLSigned(`${baseURL}${rootPath}`);

      expect(doRequestSpy).toHaveBeenCalledTimes(1);
      expect(doRequestSpy).toHaveBeenCalledWith({
        ...requestBase,
        path: rootPath,
      });
      expect(rootResult).toEqual(successResponse);
      doRequestSpy.mockClear();

      const nestedPath = "/file/folder/sub1/sub2/my-test-file.txt";
      const nestedResult = await filesInstance.getFileURLSigned(`${baseURL}${nestedPath}`);

      expect(doRequestSpy).toHaveBeenCalledTimes(1);
      expect(doRequestSpy).toHaveBeenCalledWith({
        ...requestBase,
        path: nestedPath,
      });
      expect(nestedResult).toEqual(successResponse);
    });

    it("returns error for invalid protocols", async () => {
      const filePath = "/file/my-test-file.txt";

      await expect(filesInstance.getFileURLSigned(`mailto:test@tago.io${filePath}`)).rejects.toMatch(
        /invalid protocol/
      );
      await expect(filesInstance.getFileURLSigned(`mailto:test@tago.io${filePath}`)).rejects.toMatch(
        /invalid protocol/
      );
      await expect(filesInstance.getFileURLSigned(`ftp://ftp.tago.io${filePath}`)).rejects.toMatch(/invalid protocol/);

      expect(doRequestSpy).not.toHaveBeenCalled();
    });

    it("returns error for URLs without the proper files path", async () => {
      const baseURL = "https://api.tago.io";

      await expect(filesInstance.getFileURLSigned(`${baseURL}`)).rejects.toMatch(/invalid path/);
      await expect(filesInstance.getFileURLSigned(`${baseURL}/`)).rejects.toMatch(/invalid path/);
      await expect(filesInstance.getFileURLSigned(`${baseURL}/file`)).rejects.toMatch(/invalid path/);
      await expect(filesInstance.getFileURLSigned(`${baseURL}/file.txt`)).rejects.toMatch(/invalid path/);
      await expect(filesInstance.getFileURLSigned(`${baseURL}/FILE/something.txt`)).rejects.toMatch(/invalid path/);
      await expect(filesInstance.getFileURLSigned(`${baseURL}/test/file/something.txt`)).rejects.toMatch(
        /invalid path/
      );
      await expect(filesInstance.getFileURLSigned(`${baseURL}/files/something.txt`)).rejects.toMatch(/invalid path/);

      await expect(filesInstance.getFileURLSigned("https://file")).rejects.toMatch(/invalid path/);
      await expect(filesInstance.getFileURLSigned("https://file/test.txt")).rejects.toMatch(/invalid path/);

      expect(doRequestSpy).not.toHaveBeenCalled();
    });

    it("returns error for malformed URLs", async () => {
      await expect(filesInstance.getFileURLSigned("https:/")).rejects.toMatch(/not a valid URL/);
      await expect(filesInstance.getFileURLSigned("https://")).rejects.toMatch(/not a valid URL/);

      expect(doRequestSpy).not.toHaveBeenCalled();
    });
  });
});
