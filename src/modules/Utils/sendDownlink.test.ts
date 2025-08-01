import { handleDownlinkError } from "./sendDownlink.ts";

interface DownlinkError {
  response?: {
    status: number;
    data: any;
  };
  message?: string;
}

describe("Error Handling", () => {
  test("Default Error", async () => {
    const error: DownlinkError = {
      response: { data: null, status: 400 },
      message: "",
    };

    await handleDownlinkError(error).catch((message) => {
      expect(message).toBe("Downlink failed with status 400: null");
    });
  });

  test("Undefined Error", async () => {
    const error: DownlinkError = {
      response: { data: undefined, status: 400 },
      message: "",
    };

    await handleDownlinkError(error).catch((message) => {
      expect(message).toBe("Downlink failed with status 400: undefined");
    });
  });

  test("Authorization error", async () => {
    const error: DownlinkError = {
      response: { data: "Authorization is missing", status: 400 },
      message: "",
    };

    await handleDownlinkError(error).catch((message) => {
      expect(message).toBe("Additional parameter is missing with in the TagoIO Authorization used for this device");
    });
  });

  test("String error", async () => {
    const error: DownlinkError = {
      response: { data: "test", status: 400 },
      message: "",
    };

    await handleDownlinkError(error).catch((message) => {
      expect(message).toBe('Downlink failed with status 400: "test"');
    });
  });

  test("JSON Error", async () => {
    const error: DownlinkError = {
      response: { data: { param: "value" }, status: 400 },
      message: "",
    };

    await handleDownlinkError(error).catch((message) => {
      expect(message).toBe('Downlink failed with status 400: {"param":"value"}');
    });
  });

  test("Number Error", async () => {
    const error: DownlinkError = {
      response: { data: 20, status: 400 },
      message: "",
    };

    await handleDownlinkError(error).catch((message) => {
      expect(message).toBe("Downlink failed with status 400: 20");
    });
  });
});
