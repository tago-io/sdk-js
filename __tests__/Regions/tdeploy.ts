import { describe, expect, it } from "vitest";
import getConnectionURI from "../../src/regions.ts";

describe("TagoIO Deploy (tdeploy) Region Support", () => {
  it("should generate correct endpoints for tdeploy region", () => {
    const tdeploy = "68951c0e023862b2aea00f3f";
    const region = { tdeploy, api: "", sse: "" };

    const result = getConnectionURI(region);

    expect(result.api).toBe(`https://api.${tdeploy}.tagoio.net`);
    expect(result.sse).toBe(`https://sse.${tdeploy}.tagoio.net/events`);
  });

  it("should prioritize tdeploy over other fields when both are provided", () => {
    const tdeploy = "68951c0e023862b2aea00f3f";
    const region = {
      tdeploy,
      api: "https://custom-api.example.com",
      sse: "https://custom-sse.example.com",
    };

    const result = getConnectionURI(region);

    expect(result.api).toBe(`https://api.${tdeploy}.tagoio.net`);
    expect(result.sse).toBe(`https://sse.${tdeploy}.tagoio.net/events`);
  });

  it("should trim whitespace from tdeploy value", () => {
    const tdeploy = "  68951c0e023862b2aea00f3f  ";
    const region = { tdeploy, api: "", sse: "" };

    const result = getConnectionURI(region);

    expect(result.api).toBe("https://api.68951c0e023862b2aea00f3f.tagoio.net");
    expect(result.sse).toBe("https://sse.68951c0e023862b2aea00f3f.tagoio.net/events");
  });

  it("should fallback to standard behavior when tdeploy is empty", () => {
    const region = {
      tdeploy: "",
      api: "https://custom-api.example.com",
      sse: "https://custom-sse.example.com",
    };

    const result = getConnectionURI(region);

    expect(result.api).toBe("https://custom-api.example.com");
    expect(result.sse).toBe("https://custom-sse.example.com");
  });

  it("should fallback to standard behavior when tdeploy is whitespace only", () => {
    const region = {
      tdeploy: "   ",
      api: "https://custom-api.example.com",
      sse: "https://custom-sse.example.com",
    };

    const result = getConnectionURI(region);

    expect(result.api).toBe("https://custom-api.example.com");
    expect(result.sse).toBe("https://custom-sse.example.com");
  });

  it("should maintain backward compatibility with existing regions", () => {
    const result1 = getConnectionURI("us-e1");
    expect(result1.api).toBe("https://api.tago.io");
    expect(result1.sse).toBe("https://sse.tago.io/events");

    const result2 = getConnectionURI("eu-w1");
    expect(result2.api).toBe("https://api.eu-w1.tago.io");
    expect(result2.sse).toBe("https://sse.eu-w1.tago.io/events");
  });

  it("should maintain backward compatibility with custom RegionsObj", () => {
    const customRegion = {
      api: "https://my-api.com",
      sse: "https://my-sse.com",
    };

    const result = getConnectionURI(customRegion);

    expect(result.api).toBe("https://my-api.com");
    expect(result.sse).toBe("https://my-sse.com");
  });
});
