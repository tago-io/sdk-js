import { AxiosError } from "axios";
import { handleDownlinkError } from "./sendDownlink";

describe("Error Handling", () => {
  test("Default Axios Error", async () => {
    const error: AxiosError = {
      response: { data: null, status: 400, config: {}, headers: {}, statusText: "" },
      message: "",
      config: {},
      name: "",
      toJSON: () => null,
      isAxiosError: false,
    };

    await handleDownlinkError(error).catch((message) => {
      expect(message).toBe("Downlink failed with status 400: null");
    });
  });

  test("Undefined Axios Error", async () => {
    const error: AxiosError = {
      response: { data: undefined, status: 400, config: {}, headers: {}, statusText: "" },
      message: "",
      config: {},
      name: "",
      toJSON: () => null,
      isAxiosError: false,
    };

    await handleDownlinkError(error).catch((message) => {
      expect(message).toBe("Downlink failed with status 400: undefined");
    });
  });

  test("Authorization error", async () => {
    const error: AxiosError = {
      response: { data: "Authorization is missing", status: 400, config: {}, headers: {}, statusText: "" },
      message: "",
      config: {},
      name: "",
      toJSON: () => null,
      isAxiosError: false,
    };

    await handleDownlinkError(error).catch((message) => {
      expect(message).toBe("Additional parameter is missing with in the TagoIO Authorization used for this device");
    });
  });

  test("String error", async () => {
    const error: AxiosError = {
      response: { data: "test", status: 400, config: {}, headers: {}, statusText: "" },
      message: "",
      config: {},
      name: "",
      toJSON: () => null,
      isAxiosError: false,
    };

    await handleDownlinkError(error).catch((message) => {
      expect(message).toBe('Downlink failed with status 400: "test"');
    });
  });

  test("JSON Error", async () => {
    const error: AxiosError = {
      response: { data: { param: "value" }, status: 400, config: {}, headers: {}, statusText: "" },
      message: "",
      config: {},
      name: "",
      toJSON: () => null,
      isAxiosError: false,
    };

    await handleDownlinkError(error).catch((message) => {
      expect(message).toBe('Downlink failed with status 400: {"param":"value"}');
    });
  });

  test("Number Error", async () => {
    const error: AxiosError = {
      response: { data: 20, status: 400, config: {}, headers: {}, statusText: "" },
      message: "",
      config: {},
      name: "",
      toJSON: () => null,
      isAxiosError: false,
    };

    await handleDownlinkError(error).catch((message) => {
      expect(message).toBe("Downlink failed with status 400: 20");
    });
  });
});
