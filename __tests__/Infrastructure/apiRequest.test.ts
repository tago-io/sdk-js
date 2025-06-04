import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import apiRequest from "../../src/infrastructure/apiRequest";
// Import the mocked function so we can control it in tests
import isBrowser from "../../src/infrastructure/isBrowser";

import type { RequestConfig } from "../../src/common/common.types";

// Mock the global fetch function
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock the environment params
vi.mock("../../src/infrastructure/envParams.json", () => ({
  default: { version: "12.0.0" },
}));

// Mock the sleep function to avoid delays in tests
vi.mock("../../src/common/sleep", () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

// Mock isBrowser function to test environment-specific behavior
vi.mock("../../src/infrastructure/isBrowser", () => ({
  default: vi.fn().mockReturnValue(false), // Default to Node.js environment
}));

describe("apiRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Success Cases", () => {
    it("should successfully handle a GET request and return processed data", async () => {
      // Arrange: Mock successful API response with TagoIO standard format
      // TagoIO API responses have { status: true, result: {...} } format
      const mockResponseData = {
        status: true,
        result: { message: "Success", data: [{ id: "123", name: "Test" }] },
      };

      // Mock fetch to return a successful HTTP response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Map([["content-type", "application/json"]]),
        json: async () => mockResponseData,
      });

      // Request configuration for the API call
      const requestConfig: RequestConfig = {
        url: "https://api.tago.io/test",
        method: "GET",
        headers: {
          Authorization: "Bearer test-token",
        },
      };

      // Act: Execute the request
      const result = await apiRequest(requestConfig);

      // Assert: Verify the result is processed correctly
      // The resultHandler extracts and returns the 'result' field from the API response
      expect(result).toEqual({
        message: "Success",
        data: [{ id: "123", name: "Test" }],
      });

      // Verify fetch was called with correct parameters
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.tago.io/test",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
          }),
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it("should successfully handle a POST request to create a device", async () => {
      // Arrange: Mock successful device creation response
      const mockResponseData = {
        status: true,
        result: {
          id: "64f1a2b3c4d5e6f7a8b9c0d1",
          name: "My first device",
          type: "mutable",
          network: "5bbd0d144051a50034cd19fb",
          connector: "5f5a8f3351d4db99c40dece5",
          serie_number: "AB87392C12CA",
          created_at: "2023-09-01T10:30:00Z",
        },
      };

      // Mock fetch to return a successful HTTP response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        statusText: "Created",
        headers: new Map([["content-type", "application/json"]]),
        json: async () => mockResponseData,
      });

      // Device data to be sent in the request body
      const deviceData = {
        name: "My first device",
        type: "mutable",
        network: "5bbd0d144051a50034cd19fb",
        connector: "5f5a8f3351d4db99c40dece5",
        serie_number: "AB87392C12CA",
      };

      // Request configuration for the API call
      const requestConfig: RequestConfig = {
        url: "https://api.tago.io/device",
        method: "POST",
        headers: {
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
        },
        data: deviceData,
      };

      // Act: Execute the request
      const result = await apiRequest(requestConfig);

      // Assert: Verify the result is processed correctly
      expect(result).toEqual({
        id: "64f1a2b3c4d5e6f7a8b9c0d1",
        name: "My first device",
        type: "mutable",
        network: "5bbd0d144051a50034cd19fb",
        connector: "5f5a8f3351d4db99c40dece5",
        serie_number: "AB87392C12CA",
        created_at: "2023-09-01T10:30:00Z",
      });

      // Verify fetch was called with correct parameters
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.tago.io/device",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(deviceData),
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it("should use cache when same route is called twice with cacheTTL", async () => {
      // Arrange: Mock successful API response
      const mockResponseData = {
        status: true,
        result: {
          message: "Cached response",
          data: [{ id: "cache-test", name: "Test Cache" }],
        },
      };

      // Mock fetch to return a successful HTTP response
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Map([["content-type", "application/json"]]),
        json: async () => mockResponseData,
      });

      // Request configuration for the API call
      const requestConfig: RequestConfig = {
        url: "https://api.tago.io/test-cache",
        method: "GET",
        headers: {
          Authorization: "Bearer test-token",
        },
      };

      // Cache TTL in milliseconds (5 seconds)
      const cacheTTL = 5000;

      // Act: Execute the first request
      const firstResult = await apiRequest(requestConfig, cacheTTL);

      // Act: Execute the second request immediately (should use cache)
      const secondResult = await apiRequest(requestConfig, cacheTTL);

      // Assert: Both results should be identical
      expect(firstResult).toEqual({
        message: "Cached response",
        data: [{ id: "cache-test", name: "Test Cache" }],
      });
      expect(secondResult).toEqual(firstResult);

      // Assert: fetch should only be called once (first request)
      // The second request should use the cached result
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.tago.io/test-cache",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
          }),
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it("should handle URL query parameters correctly", async () => {
      // Arrange: Mock successful response
      const mockResponseData = {
        status: true,
        result: { data: "filtered results" },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Map([["content-type", "application/json"]]),
        json: async () => mockResponseData,
      });

      // Test case 1: URL without existing query parameters
      const requestConfig1: RequestConfig = {
        url: "https://api.tago.io/devices",
        method: "GET",
        params: {
          filter: "active",
          limit: 10,
          sort: "name",
        },
      };

      // Act: Execute request
      await apiRequest(requestConfig1);

      // Assert: URL should have query parameters added with "?"
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.tago.io/devices?filter=active&limit=10&sort=name",
        expect.any(Object),
      );

      // Reset mock for next test
      mockFetch.mockClear();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Map([["content-type", "application/json"]]),
        json: async () => mockResponseData,
      });

      // Test case 2: URL already containing query parameters
      const requestConfig2: RequestConfig = {
        url: "https://api.tago.io/devices?page=1",
        method: "GET",
        params: {
          filter: "active",
          limit: 10,
        },
      };

      // Act: Execute request
      await apiRequest(requestConfig2);

      // Assert: URL should have query parameters added with "&"
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.tago.io/devices?page=1&filter=active&limit=10",
        expect.any(Object),
      );
    });

    it("should handle string request body correctly", async () => {
      // Arrange: Mock successful response
      const mockResponseData = {
        status: true,
        result: { message: "Raw data processed" },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Map([["content-type", "application/json"]]),
        json: async () => mockResponseData,
      });

      // String data (e.g., raw payload, XML, or pre-serialized JSON)
      const stringData =
        '{"device_id":"123","value":42.5,"timestamp":"2023-09-01T10:30:00Z"}';

      const requestConfig: RequestConfig = {
        url: "https://api.tago.io/data",
        method: "POST",
        headers: {
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
        },
        data: stringData,
      };

      // Act: Execute request
      const result = await apiRequest(requestConfig);

      // Assert: Verify result
      expect(result).toEqual({ message: "Raw data processed" });

      // Assert: Verify string body is passed directly without JSON.stringify
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.tago.io/data",
        expect.objectContaining({
          method: "POST",
          body: stringData, // Should be the original string, not JSON.stringify(stringData)
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
            "Content-Type": "application/json",
          }),
        }),
      );
    });

    it("should add browser-specific headers when in browser environment", async () => {
      // Arrange: Mock browser environment
      vi.mocked(isBrowser).mockReturnValue(true);

      const mockResponseData = {
        status: true,
        result: { message: "Browser request" },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Map([["content-type", "application/json"]]),
        json: async () => mockResponseData,
      });

      const requestConfig: RequestConfig = {
        url: "https://api.tago.io/test",
        method: "GET",
        headers: {
          Authorization: "Bearer test-token",
        },
      };

      // Act: Execute request
      await apiRequest(requestConfig);

      // Assert: Should include browser cache prevention headers
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.tago.io/test",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
          }),
        }),
      );

      // Reset browser mock
      vi.mocked(isBrowser).mockReturnValue(false);
    });

    it("should add Node.js User-Agent header when not in browser", async () => {
      // Arrange: Mock Node.js environment (default)
      vi.mocked(isBrowser).mockReturnValue(false);

      const mockResponseData = {
        status: true,
        result: { message: "Node.js request" },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Map([["content-type", "application/json"]]),
        json: async () => mockResponseData,
      });

      const requestConfig: RequestConfig = {
        url: "https://api.tago.io/test",
        method: "GET",
        headers: {
          Authorization: "Bearer test-token",
        },
      };

      // Act: Execute request
      await apiRequest(requestConfig);

      // Assert: Should include Node.js User-Agent header
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.tago.io/test",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
            "User-Agent": expect.stringMatching(
              /^TagoIO-SDK\|JS\|12\.0\.0 \(External; Node\.js\//,
            ),
          }),
        }),
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle AbortError (timeout) and retry with proper error formatting", async () => {
      // Arrange: Mock AbortError on all attempts
      const abortError = new Error("The operation was aborted.");
      abortError.name = "AbortError";

      mockFetch.mockRejectedValue(abortError);

      const requestConfig: RequestConfig = {
        url: "https://api.tago.io/timeout-test",
        method: "GET",
        headers: { Authorization: "Bearer test-token" },
        timeout: 5000,
      };

      // Act & Assert: Should throw timeout error after all retry attempts
      await expect(apiRequest(requestConfig)).rejects.toEqual({
        from: "CLIENT_REQUEST",
        url: "https://api.tago.io/timeout-test",
        method: "GET",
        status: -1,
        code: "TIMEOUT",
        statusText: "Request timeout",
      });

      // Should retry 5 times (default requestAttempts)
      expect(mockFetch).toHaveBeenCalledTimes(5);
    }, 10000);

    it("should handle TypeError (network error) and retry with proper error formatting", async () => {
      // Arrange: Mock network error on all attempts
      const networkError = new TypeError("Failed to fetch");

      mockFetch.mockRejectedValue(networkError);

      const requestConfig: RequestConfig = {
        url: "https://api.tago.io/network-error-test",
        method: "POST",
        headers: { Authorization: "Bearer test-token" },
        data: { test: "data" },
      };

      // Act & Assert: Should throw network error after all retry attempts
      await expect(apiRequest(requestConfig)).rejects.toEqual({
        from: "CLIENT_REQUEST",
        url: "https://api.tago.io/network-error-test",
        method: "POST",
        status: -1,
        code: "NETWORK_ERROR",
        statusText: "Failed to fetch",
      });

      // Should retry 5 times (default requestAttempts)
      expect(mockFetch).toHaveBeenCalledTimes(5);
    }, 10000);

    it("should handle complete network loss scenarios", async () => {
      // Test case 1: Network disconnection
      const networkDisconnectedError = new TypeError(
        "fetch failed due to network disconnection",
      );

      mockFetch.mockRejectedValue(networkDisconnectedError);

      const requestConfig1: RequestConfig = {
        url: "https://api.tago.io/device/list",
        method: "GET",
        headers: { Authorization: "Bearer test-token" },
      };

      await expect(apiRequest(requestConfig1)).rejects.toEqual({
        from: "CLIENT_REQUEST",
        url: "https://api.tago.io/device/list",
        method: "GET",
        status: -1,
        code: "NETWORK_ERROR",
        statusText: "fetch failed due to network disconnection",
      });

      expect(mockFetch).toHaveBeenCalledTimes(5);
      mockFetch.mockClear();

      // Test case 2: DNS resolution failure
      const dnsError = new TypeError(
        "fetch: getaddrinfo ENOTFOUND api.tago.io",
      );

      mockFetch.mockRejectedValue(dnsError);

      const requestConfig2: RequestConfig = {
        url: "https://api.tago.io/analysis/run",
        method: "POST",
        headers: { Authorization: "Bearer test-token" },
        data: { analysis_id: "123" },
      };

      await expect(apiRequest(requestConfig2)).rejects.toEqual({
        from: "CLIENT_REQUEST",
        url: "https://api.tago.io/analysis/run",
        method: "POST",
        status: -1,
        code: "NETWORK_ERROR",
        statusText: "fetch: getaddrinfo ENOTFOUND api.tago.io",
      });

      expect(mockFetch).toHaveBeenCalledTimes(5);
      mockFetch.mockClear();

      // Test case 3: Connection refused (server down)
      const connectionRefusedError = new TypeError(
        "fetch: connect ECONNREFUSED 127.0.0.1:443",
      );

      mockFetch.mockRejectedValue(connectionRefusedError);

      const requestConfig3: RequestConfig = {
        url: "https://api.tago.io/bucket/data",
        method: "POST",
        headers: { Authorization: "Bearer test-token" },
        data: [{ variable: "temperature", value: 25.5 }],
      };

      await expect(apiRequest(requestConfig3)).rejects.toEqual({
        from: "CLIENT_REQUEST",
        url: "https://api.tago.io/bucket/data",
        method: "POST",
        status: -1,
        code: "NETWORK_ERROR",
        statusText: "fetch: connect ECONNREFUSED 127.0.0.1:443",
      });

      expect(mockFetch).toHaveBeenCalledTimes(5);
    }, 10000);

    it("should handle intermittent network issues with eventual success", async () => {
      // Arrange: Network fails first few times, then succeeds
      const networkError = new TypeError("fetch temporarily unavailable");
      const successResponse = {
        status: true,
        result: {
          message: "Data uploaded successfully after network recovery",
          uploaded_count: 1,
        },
      };

      // First 3 calls fail with network error, 4th call succeeds
      mockFetch
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Map([["content-type", "application/json"]]),
          json: async () => successResponse,
        });

      const requestConfig: RequestConfig = {
        url: "https://api.tago.io/data",
        method: "POST",
        headers: {
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
        },
        data: [
          {
            variable: "temperature",
            value: 23.5,
            time: new Date().toISOString(),
          },
          { variable: "humidity", value: 65.2, time: new Date().toISOString() },
        ],
      };

      // Act: Should eventually succeed after network recovery
      const result = await apiRequest(requestConfig);

      // Assert: Should return success result
      expect(result).toEqual({
        message: "Data uploaded successfully after network recovery",
        uploaded_count: 1,
      });

      // Should have been called 4 times (3 network failures + 1 success)
      expect(mockFetch).toHaveBeenCalledTimes(4);
    }, 15000);

    it("should handle network loss during data upload (large payload)", async () => {
      // Arrange: Simulate network loss during large data upload
      const networkLossError = new TypeError(
        "fetch: The network connection was lost",
      );

      mockFetch.mockRejectedValue(networkLossError);

      // Large payload simulation
      const largeDataPayload = Array.from({ length: 100 }, (_, i) => ({
        variable: `sensor_${i}`,
        value: Math.random() * 100,
        time: new Date(Date.now() - i * 1000).toISOString(),
        metadata: {
          device_id: `device_${Math.floor(i / 10)}`,
          location: { lat: 40.7128 + i * 0.001, lng: -74.006 + i * 0.001 },
        },
      }));

      const requestConfig: RequestConfig = {
        url: "https://api.tago.io/data",
        method: "POST",
        headers: {
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
        },
        data: largeDataPayload,
      };

      // Act & Assert: Should handle network loss during upload
      await expect(apiRequest(requestConfig)).rejects.toEqual({
        from: "CLIENT_REQUEST",
        url: "https://api.tago.io/data",
        method: "POST",
        status: -1,
        code: "NETWORK_ERROR",
        statusText: "fetch: The network connection was lost",
      });

      // Should retry all 5 times for network errors
      expect(mockFetch).toHaveBeenCalledTimes(5);

      // Verify that large payload is properly serialized in request body
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.tago.io/data",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(largeDataPayload),
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
            "Content-Type": "application/json",
          }),
        }),
      );
    }, 15000);

    it("should handle server errors (5xx) and retry with proper error formatting", async () => {
      // Arrange: Mock 500 Internal Server Error on all attempts
      const serverErrorResponse = {
        message: "Internal server error occurred",
        code: "INTERNAL_ERROR",
      };

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        headers: new Map([["content-type", "application/json"]]),
        json: async () => serverErrorResponse,
      });

      const requestConfig: RequestConfig = {
        url: "https://api.tago.io/server-error-test",
        method: "GET",
        headers: { Authorization: "Bearer test-token" },
      };

      // Act & Assert: Should throw server error after all retry attempts
      await expect(apiRequest(requestConfig)).rejects.toEqual({
        from: "SERVER_RESPONSE",
        url: "https://api.tago.io/server-error-test",
        method: "GET",
        status: 500,
        code: "HTTP_ERROR",
        statusText: "Internal Server Error",
      });

      // Should retry 5 times for server errors (5xx)
      expect(mockFetch).toHaveBeenCalledTimes(5);
    }, 10000);

    it("should handle client errors (4xx) without retry and use resultHandler", async () => {
      // Arrange: Mock 400 Bad Request error with message
      const clientErrorResponse = {
        status: false,
        message: "Missing 'name' field",
        result: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        headers: new Map([["content-type", "application/json"]]),
        json: async () => clientErrorResponse,
      });

      const requestConfig: RequestConfig = {
        url: "https://api.tago.io/client-error-test",
        method: "POST",
        headers: { Authorization: "Bearer test-token" },
        data: { type: "mutable" }, // Missing required 'name' field
      };

      // Act & Assert: Should throw client error immediately without retry
      await expect(apiRequest(requestConfig)).rejects.toEqual(
        "Missing 'name' field",
      );

      // Should NOT retry for client errors (4xx) - only called once
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should handle client error with result data instead of message", async () => {
      // Arrange: Mock 422 Unprocessable Entity with result data
      const validationErrorResponse = {
        status: false,
        message: null,
        result: {
          validation_errors: [
            { field: "name", message: "Name is required" },
            { field: "email", message: "Invalid email format" },
          ],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        statusText: "Unprocessable Entity",
        headers: new Map([["content-type", "application/json"]]),
        json: async () => validationErrorResponse,
      });

      const requestConfig: RequestConfig = {
        url: "https://api.tago.io/validation-error-test",
        method: "POST",
        headers: { Authorization: "Bearer test-token" },
        data: { email: "invalid-email" },
      };

      // Act & Assert: Should throw validation error with result data
      await expect(apiRequest(requestConfig)).rejects.toEqual({
        validation_errors: [
          { field: "name", message: "Name is required" },
          { field: "email", message: "Invalid email format" },
        ],
      });

      // Should NOT retry for client errors (4xx) - only called once
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should handle unknown errors and retry with proper error formatting", async () => {
      // Arrange: Mock unknown/unexpected error
      const unknownError = new Error("Something unexpected happened");
      unknownError.name = "UnknownError";

      mockFetch.mockRejectedValue(unknownError);

      const requestConfig: RequestConfig = {
        url: "https://api.tago.io/unknown-error-test",
        method: "DELETE",
        headers: { Authorization: "Bearer test-token" },
      };

      // Act & Assert: Should throw unknown error after all retry attempts
      await expect(apiRequest(requestConfig)).rejects.toEqual({
        from: "CLIENT_REQUEST",
        url: "https://api.tago.io/unknown-error-test",
        method: "DELETE",
        status: -1,
        code: "UNKNOWN",
        statusText: "Something unexpected happened",
      });

      // Should retry 5 times (default requestAttempts)
      expect(mockFetch).toHaveBeenCalledTimes(5);
    }, 10000);

    it("should handle error without message property", async () => {
      // Arrange: Mock error object without message property
      const errorWithoutMessage = { someProperty: "some value" };

      mockFetch.mockRejectedValue(errorWithoutMessage);

      const requestConfig: RequestConfig = {
        url: "https://api.tago.io/error-without-message",
        method: "GET",
        headers: { Authorization: "Bearer test-token" },
      };

      // Act & Assert: Should throw unknown error with default message
      await expect(apiRequest(requestConfig)).rejects.toEqual({
        from: "CLIENT_REQUEST",
        url: "https://api.tago.io/error-without-message",
        method: "GET",
        status: -1,
        code: "UNKNOWN",
        statusText: "Unknown error",
      });

      // Should retry 5 times (default requestAttempts)
      expect(mockFetch).toHaveBeenCalledTimes(5);
    }, 10000);

    it("should handle mixed error scenarios - timeout then success", async () => {
      // Arrange: Mock timeout error on first few attempts, then success
      const abortError = new Error("The operation was aborted.");
      abortError.name = "AbortError";

      const successResponse = {
        status: true,
        result: { message: "Finally succeeded after retries" },
      };

      // First 2 calls fail with timeout, 3rd call succeeds
      mockFetch
        .mockRejectedValueOnce(abortError)
        .mockRejectedValueOnce(abortError)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Map([["content-type", "application/json"]]),
          json: async () => successResponse,
        });

      const requestConfig: RequestConfig = {
        url: "https://api.tago.io/mixed-error-test",
        method: "GET",
        headers: { Authorization: "Bearer test-token" },
      };

      // Act: Should eventually succeed after retries
      const result = await apiRequest(requestConfig);

      // Assert: Should return success result
      expect(result).toEqual({ message: "Finally succeeded after retries" });

      // Should have been called 3 times (2 failures + 1 success)
      expect(mockFetch).toHaveBeenCalledTimes(3);
    }, 10000);

    it("should handle resultHandler error during client error processing", async () => {
      // Arrange: Mock client error that causes resultHandler to throw
      const problematicResponse = {
        status: false,
        message: null,
        result: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        headers: new Map([["content-type", "application/json"]]),
        json: async () => problematicResponse,
      });

      const requestConfig: RequestConfig = {
        url: "https://api.tago.io/resulthandler-error-test",
        method: "POST",
        headers: { Authorization: "Bearer test-token" },
        data: { invalid: "data" },
      };

      // Act & Assert: Should throw the resultHandler processed error
      // When resultHandler processes a response with status: false and no message/result,
      // it returns the response data itself
      await expect(apiRequest(requestConfig)).rejects.toEqual(
        problematicResponse,
      );

      // Should NOT retry for client errors (4xx) - only called once
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});

