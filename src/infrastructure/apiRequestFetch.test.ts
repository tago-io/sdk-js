import { http, HttpResponse, delay } from "msw";
import { setupServer } from "msw/node";
import type { RequestConfig } from "../common/common.types.ts";
import config from "../config.ts";
import apiRequest from "./apiRequest.ts";

// Mock the config to control request attempts and timeout
vi.mock("../config", () => ({
  default: {
    requestAttempts: 3,
    requestTimeout: 1000,
  },
}));

// Mock environment params
vi.mock("./envParams.ts", () => ({
  version: "1.0.0",
}));

// Mock isBrowser to return false for Node.js environment
vi.mock("./isBrowser", () => ({
  default: () => false,
}));

// Mock cache and request progress functions
vi.mock("../common/Cache", () => ({
  addCache: vi.fn(),
  getCache: vi.fn(() => null),
}));

vi.mock("../common/RequestInProgress", () => ({
  addRequestInProgress: vi.fn(),
  isRequestInProgress: vi.fn(() => false),
  removeRequestInProgress: vi.fn(),
}));

// Mock sleep function to speed up tests
vi.mock("../common/sleep", () => ({
  default: vi.fn(() => Promise.resolve()),
}));

const BASE_URL = "https://api.test.com";

// Create MSW server
const server = setupServer();

describe("apiRequestFetch", () => {
  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset config for each test
    config.requestAttempts = 3;
    config.requestTimeout = 1000;
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  describe("Successful requests", () => {
    it("should handle successful GET request", async () => {
      server.use(
        http.get(`${BASE_URL}/test`, () => {
          return HttpResponse.json({
            status: true,
            result: { message: "success" },
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/test`,
        method: "GET",
      };

      const result = await apiRequest(requestConfig);
      expect(result).toEqual({ message: "success" });
    });

    it("should handle successful POST request with JSON body", async () => {
      server.use(
        http.post(`${BASE_URL}/test`, async ({ request }) => {
          const body = await request.json();
          expect(body).toEqual({ test: "data" });

          return HttpResponse.json({
            status: true,
            result: { created: true },
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/test`,
        method: "POST",
        data: { test: "data" },
      };

      const result = await apiRequest(requestConfig);
      expect(result).toEqual({ created: true });
    });

    it("should handle successful request with string body", async () => {
      server.use(
        http.post(`${BASE_URL}/test`, async ({ request }) => {
          const body = await request.text();
          expect(body).toBe("raw data");

          return HttpResponse.json({
            status: true,
            result: { received: true },
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/test`,
        method: "POST",
        data: "raw data",
      };

      const result = await apiRequest(requestConfig);
      expect(result).toEqual({ received: true });
    });
  });

  describe("Timeout scenarios", () => {
    it("should handle timeout error and retry", async () => {
      let attemptCount = 0;

      server.use(
        http.get(`${BASE_URL}/timeout`, async () => {
          attemptCount++;
          if (attemptCount <= 2) {
            // Delay longer than timeout to trigger timeout
            await delay(1500);
            return HttpResponse.json({ status: true, result: {} });
          }
          // Third attempt succeeds quickly
          return HttpResponse.json({
            status: true,
            result: { success: true },
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/timeout`,
        method: "GET",
        timeout: 1000,
      };

      const result = await apiRequest(requestConfig);
      expect(result).toEqual({ success: true });
      expect(attemptCount).toBe(3);
    });

    it("should fail after all retry attempts on timeout", async () => {
      server.use(
        http.get(`${BASE_URL}/timeout-fail`, async () => {
          // Always delay longer than timeout
          await delay(1500);
          return HttpResponse.json({ status: true, result: {} });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/timeout-fail`,
        method: "GET",
        timeout: 1000,
      };

      await expect(apiRequest(requestConfig)).rejects.toEqual({
        from: "CLIENT_REQUEST",
        url: `${BASE_URL}/timeout-fail`,
        method: "GET",
        status: -1,
        code: "TIMEOUT",
        statusText: "Request timeout",
      });
    });
  });

  describe("Network error scenarios", () => {
    it("should handle network errors and retry", async () => {
      let attemptCount = 0;

      server.use(
        http.get(`${BASE_URL}/network-error`, () => {
          attemptCount++;
          if (attemptCount <= 2) {
            return HttpResponse.error();
          }
          return HttpResponse.json({
            status: true,
            result: { recovered: true },
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/network-error`,
        method: "GET",
      };

      const result = await apiRequest(requestConfig);
      expect(result).toEqual({ recovered: true });
      expect(attemptCount).toBe(3);
    });

    it("should fail after all retry attempts on network error", async () => {
      server.use(
        http.get(`${BASE_URL}/network-fail`, () => {
          return HttpResponse.error();
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/network-fail`,
        method: "GET",
      };

      await expect(apiRequest(requestConfig)).rejects.toEqual({
        from: "CLIENT_REQUEST",
        url: `${BASE_URL}/network-fail`,
        method: "GET",
        status: -1,
        code: "NETWORK_ERROR",
        statusText: "fetch failed",
      });
    });
  });

  describe("HTTP error scenarios", () => {
    it("should handle 500 server errors and retry", async () => {
      let attemptCount = 0;

      server.use(
        http.get(`${BASE_URL}/server-error`, () => {
          attemptCount++;
          if (attemptCount <= 2) {
            return new HttpResponse("Internal Server Error", { status: 500 });
          }
          return HttpResponse.json({
            status: true,
            result: { recovered: true },
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/server-error`,
        method: "GET",
      };

      const result = await apiRequest(requestConfig);
      expect(result).toEqual({ recovered: true });
      expect(attemptCount).toBe(3);
    });

    it("should fail after all retry attempts on 500 error", async () => {
      server.use(
        http.get(`${BASE_URL}/server-error-fail`, () => {
          return new HttpResponse("Internal Server Error", { status: 500 });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/server-error-fail`,
        method: "GET",
      };

      await expect(apiRequest(requestConfig)).rejects.toEqual({
        from: "SERVER_RESPONSE",
        url: `${BASE_URL}/server-error-fail`,
        method: "GET",
        status: 500,
        code: "HTTP_ERROR",
        statusText: "Internal Server Error",
      });
    });

    it("should not retry on 4xx client errors", async () => {
      let attemptCount = 0;

      server.use(
        http.get(`${BASE_URL}/client-error`, () => {
          attemptCount++;
          return HttpResponse.json(
            {
              status: false,
              message: "Not found",
            },
            { status: 404 }
          );
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/client-error`,
        method: "GET",
      };

      await expect(apiRequest(requestConfig)).rejects.toBe("Not found");
      expect(attemptCount).toBe(1); // Should not retry
    });

    it("should handle 401 unauthorized errors", async () => {
      let attemptCount = 0;

      server.use(
        http.get(`${BASE_URL}/unauthorized`, () => {
          attemptCount++;
          return HttpResponse.json(
            {
              status: false,
              message: "Unauthorized access",
            },
            { status: 401 }
          );
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/unauthorized`,
        method: "GET",
      };

      await expect(apiRequest(requestConfig)).rejects.toBe("Unauthorized access");
      expect(attemptCount).toBe(1); // Should not retry
    });
    it("should handle 400 bad request errors", async () => {
      let attemptCount = 0;

      server.use(
        http.post(`${BASE_URL}/bad-request`, () => {
          attemptCount++;
          return HttpResponse.json(
            {
              status: false,
              message: "Invalid request data",
            },
            { status: 400 }
          );
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/bad-request`,
        method: "POST",
        data: { invalid: "data" },
      };

      await expect(apiRequest(requestConfig)).rejects.toBe("Invalid request data");
      expect(attemptCount).toBe(1); // Should not retry
    });

    it("should handle 422 validation errors with resultHandler", async () => {
      let attemptCount = 0;

      server.use(
        http.post(`${BASE_URL}/validation-error`, () => {
          attemptCount++;
          return HttpResponse.json(
            {
              status: false,
              result: {
                field: "email",
                error: "Invalid email format",
              },
            },
            { status: 422 }
          );
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/validation-error`,
        method: "POST",
        data: { email: "invalid-email" },
      };

      await expect(apiRequest(requestConfig)).rejects.toEqual({
        field: "email",
        error: "Invalid email format",
      });
      expect(attemptCount).toBe(1); // Should not retry
    });
  });

  describe("Response handling", () => {
    it("should handle non-JSON responses", async () => {
      server.use(
        http.get(`${BASE_URL}/text-response`, () => {
          return new HttpResponse("Plain text response", {
            status: 200,
            headers: {
              "Content-Type": "text/plain",
            },
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/text-response`,
        method: "GET",
      };

      // For non-JSON responses, the resultHandler should return the text directly
      const result = await apiRequest(requestConfig);
      expect(result).toBe("Plain text response");
    });

    it("should handle responses with status false", async () => {
      server.use(
        http.get(`${BASE_URL}/status-false`, () => {
          return HttpResponse.json({
            status: false,
            message: "Operation failed",
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/status-false`,
        method: "GET",
      };

      const result = await apiRequest(requestConfig);
      expect(result).toBe("Operation failed");
    });

    it("should handle responses with result field when status is false", async () => {
      server.use(
        http.get(`${BASE_URL}/with-result`, () => {
          return HttpResponse.json({
            status: false,
            result: "Direct result",
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/with-result`,
        method: "GET",
      };

      const result = await apiRequest(requestConfig);
      expect(result).toBe("Direct result");
    });

    it("should return the full data object when status is false and no message/result", async () => {
      server.use(
        http.get(`${BASE_URL}/full-data`, () => {
          return HttpResponse.json({
            status: false,
            error: "Something went wrong",
            code: 123,
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/full-data`,
        method: "GET",
      };

      const result = await apiRequest(requestConfig);
      expect(result).toEqual({
        status: false,
        error: "Something went wrong",
        code: 123,
      });
    });
  });

  describe("Request configuration", () => {
    it("should handle GET requests with query parameters", async () => {
      server.use(
        http.get(`${BASE_URL}/with-params`, ({ request }) => {
          const url = new URL(request.url);
          expect(url.searchParams.get("param1")).toBe("value1");
          expect(url.searchParams.get("param2")).toBe("value2");

          return HttpResponse.json({
            status: true,
            result: { received: "params" },
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/with-params`,
        method: "GET",
        params: {
          param1: "value1",
          param2: "value2",
        },
      };

      const result = await apiRequest(requestConfig);
      expect(result).toEqual({ received: "params" });
    });

    it("should handle custom headers", async () => {
      server.use(
        http.get(`${BASE_URL}/with-headers`, ({ request }) => {
          expect(request.headers.get("Authorization")).toBe("Bearer token123");
          expect(request.headers.get("Custom-Header")).toBe("custom-value");

          return HttpResponse.json({
            status: true,
            result: { headers: "received" },
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/with-headers`,
        method: "GET",
        headers: {
          Authorization: "Bearer token123",
          "Custom-Header": "custom-value",
        },
      };

      const result = await apiRequest(requestConfig);
      expect(result).toEqual({ headers: "received" });
    });

    it("should add User-Agent header in Node.js environment", async () => {
      server.use(
        http.get(`${BASE_URL}/user-agent`, ({ request }) => {
          const userAgent = request.headers.get("User-Agent");
          expect(userAgent).toMatch(/TagoIO-SDK\|JS\|1\.0\.0/);
          expect(userAgent).toMatch(/Node\.js/);

          return HttpResponse.json({
            status: true,
            result: { userAgent: "received" },
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/user-agent`,
        method: "GET",
      };

      const result = await apiRequest(requestConfig);
      expect(result).toEqual({ userAgent: "received" });
    });
  });

  describe("Query string handling with qs library", () => {
    it("should properly encode simple query parameters", async () => {
      server.use(
        http.get(`${BASE_URL}/simple-params`, ({ request }) => {
          const url = new URL(request.url);
          expect(url.searchParams.get("name")).toBe("John Doe");
          expect(url.searchParams.get("age")).toBe("30");

          return HttpResponse.json({
            status: true,
            result: { encoded: "simple" },
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/simple-params`,
        method: "GET",
        params: {
          name: "John Doe",
          age: 30,
        },
      };

      const result = await apiRequest(requestConfig);
      expect(result).toEqual({ encoded: "simple" });
    });

    it("should properly encode nested objects using qs", async () => {
      server.use(
        http.get(`${BASE_URL}/nested-params`, ({ request }) => {
          const url = new URL(request.url);
          // qs encodes nested objects as user[name]=John&user[age]=30
          expect(url.searchParams.get("user[name]")).toBe("John");
          expect(url.searchParams.get("user[age]")).toBe("30");
          expect(url.searchParams.get("active")).toBe("true");

          return HttpResponse.json({
            status: true,
            result: { encoded: "nested" },
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/nested-params`,
        method: "GET",
        params: {
          user: {
            name: "John",
            age: 30,
          },
          active: true,
        },
      };

      const result = await apiRequest(requestConfig);
      expect(result).toEqual({ encoded: "nested" });
    });

    it("should properly encode arrays using qs", async () => {
      server.use(
        http.get(`${BASE_URL}/array-params`, ({ request }) => {
          const url = new URL(request.url);
          // qs encodes arrays as tags[0]=javascript&tags[1]=typescript
          expect(url.searchParams.get("tags[0]")).toBe("javascript");
          expect(url.searchParams.get("tags[1]")).toBe("typescript");
          expect(url.searchParams.get("numbers[0]")).toBe("1");
          expect(url.searchParams.get("numbers[1]")).toBe("2");

          return HttpResponse.json({
            status: true,
            result: { encoded: "arrays" },
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/array-params`,
        method: "GET",
        params: {
          tags: ["javascript", "typescript"],
          numbers: [1, 2],
        },
      };

      const result = await apiRequest(requestConfig);
      expect(result).toEqual({ encoded: "arrays" });
    });

    it("should properly encode special characters using qs", async () => {
      server.use(
        http.get(`${BASE_URL}/special-chars`, ({ request }) => {
          const url = new URL(request.url);
          expect(url.searchParams.get("search")).toBe("user@example.com");
          expect(url.searchParams.get("filter")).toBe("name=John & age>25");
          expect(url.searchParams.get("unicode")).toBe("café");

          return HttpResponse.json({
            status: true,
            result: { encoded: "special" },
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/special-chars`,
        method: "GET",
        params: {
          search: "user@example.com",
          filter: "name=John & age>25",
          unicode: "café",
        },
      };

      const result = await apiRequest(requestConfig);
      expect(result).toEqual({ encoded: "special" });
    });

    it("should handle empty and null values in query parameters", async () => {
      server.use(
        http.get(`${BASE_URL}/empty-params`, ({ request }) => {
          const url = new URL(request.url);
          expect(url.searchParams.get("empty")).toBe("");
          expect(url.searchParams.get("null")).toBe("");
          expect(url.searchParams.get("valid")).toBe("value");
          // undefined values are not included in the query string by qs
          expect(url.searchParams.has("undefined")).toBe(false);

          return HttpResponse.json({
            status: true,
            result: { encoded: "empty" },
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/empty-params`,
        method: "GET",
        params: {
          empty: "",
          null: null,
          undefined: undefined,
          valid: "value",
        },
      };

      const result = await apiRequest(requestConfig);
      expect(result).toEqual({ encoded: "empty" });
    });

    it("should append to existing query parameters in URL", async () => {
      server.use(
        http.get(`${BASE_URL}/existing-params`, ({ request }) => {
          const url = new URL(request.url);
          expect(url.searchParams.get("existing")).toBe("param");
          expect(url.searchParams.get("new")).toBe("value");

          return HttpResponse.json({
            status: true,
            result: { encoded: "appended" },
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/existing-params?existing=param`,
        method: "GET",
        params: {
          new: "value",
        },
      };

      const result = await apiRequest(requestConfig);
      expect(result).toEqual({ encoded: "appended" });
    });

    it("should handle complex nested structures that would fail without qs", async () => {
      server.use(
        http.get(`${BASE_URL}/complex-structure`, ({ request }) => {
          const url = new URL(request.url);
          // This is a complex structure that would break TagoIO servers without proper qs encoding
          expect(url.searchParams.get("filter[devices][0][name]")).toBe("device1");
          expect(url.searchParams.get("filter[devices][0][type]")).toBe("sensor");
          expect(url.searchParams.get("filter[devices][1][name]")).toBe("device2");
          expect(url.searchParams.get("filter[tags][0]")).toBe("production");
          expect(url.searchParams.get("filter[tags][1]")).toBe("critical");
          expect(url.searchParams.get("pagination[page]")).toBe("1");
          expect(url.searchParams.get("pagination[limit]")).toBe("10");

          return HttpResponse.json({
            status: true,
            result: { encoded: "complex" },
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/complex-structure`,
        method: "GET",
        params: {
          filter: {
            devices: [{ name: "device1", type: "sensor" }, { name: "device2" }],
            tags: ["production", "critical"],
          },
          pagination: {
            page: 1,
            limit: 10,
          },
        },
      };

      const result = await apiRequest(requestConfig);
      expect(result).toEqual({ encoded: "complex" });
    });
  });

  describe("Retry logic", () => {
    it("should respect custom requestAttempts configuration", async () => {
      config.requestAttempts = 2; // Override to 2 attempts
      let attemptCount = 0;

      server.use(
        http.get(`${BASE_URL}/custom-attempts`, () => {
          attemptCount++;
          return new HttpResponse("Server Error", {
            status: 500,
            statusText: "Server Error",
          });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/custom-attempts`,
        method: "GET",
      };

      await expect(apiRequest(requestConfig)).rejects.toEqual({
        from: "SERVER_RESPONSE",
        url: `${BASE_URL}/custom-attempts`,
        method: "GET",
        status: 500,
        code: "HTTP_ERROR",
        statusText: "Server Error",
      });

      expect(attemptCount).toBe(2); // Should only try 2 times
    });

    it("should succeed on the last retry attempt", async () => {
      config.requestAttempts = 3;
      let attemptCount = 0;

      server.use(
        http.get(`${BASE_URL}/last-attempt`, () => {
          attemptCount++;
          if (attemptCount === 3) {
            return HttpResponse.json({
              status: true,
              result: { success: "on-last-attempt" },
            });
          }
          return new HttpResponse("Server Error", { status: 500 });
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/last-attempt`,
        method: "GET",
      };

      const result = await apiRequest(requestConfig);
      expect(result).toEqual({ success: "on-last-attempt" });
      expect(attemptCount).toBe(3);
    });
  });

  describe("Edge cases", () => {
    it("should handle unknown errors", async () => {
      // Mock fetch to throw an unknown error
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockRejectedValue(new Error("Unknown error"));

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/unknown-error`,
        method: "GET",
      };

      await expect(apiRequest(requestConfig)).rejects.toEqual({
        from: "CLIENT_REQUEST",
        url: `${BASE_URL}/unknown-error`,
        method: "GET",
        status: -1,
        code: "UNKNOWN",
        statusText: "Unknown error",
      });

      global.fetch = originalFetch;
    });

    it("should handle empty response data", async () => {
      server.use(
        http.get(`${BASE_URL}/empty-data`, () => {
          return HttpResponse.json(null);
        })
      );

      const requestConfig: RequestConfig = {
        url: `${BASE_URL}/empty-data`,
        method: "GET",
      };

      // For null data, the resultHandler should throw the statusText
      await expect(apiRequest(requestConfig)).rejects.toBe("OK");
    });
  });
});
