import type { MockInstance } from "vitest";
import Files from "./Files";

describe("Files", () => {
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
