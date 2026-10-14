import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";

import { type AnalysisEditInfo, type AnalysisInfo, Resources } from "../../src/modules.ts";

const ANALYSIS_ID = "6125a6a1d4c8a300120a1234";

type Captured = { url: URL; method: string; headers: Headers; body: string };
let lastCall: Captured | null = null;
let lastEditBody: any = null;

async function capture(request: Request): Promise<Captured> {
  return { url: new URL(request.url), method: request.method, headers: request.headers, body: await request.text() };
}

const handlers = [
  http.get("https://api.tago.io/endpoint", ({ request }) => {
    lastCall = { url: new URL(request.url), method: request.method, headers: request.headers, body: "" };
    return HttpResponse.json({
      status: true,
      result: [{ id: ANALYSIS_ID, name: "My Page", url: `https://api.tago.io/endpoint/${ANALYSIS_ID}` }],
    });
  }),
  http.put(`https://api.tago.io/analysis/${ANALYSIS_ID}`, async ({ request }) => {
    lastEditBody = await request.json();
    return HttpResponse.json({ status: true, result: "Successfully Updated" });
  }),
  http.get(`https://api.tago.io/analysis/${ANALYSIS_ID}`, () =>
    HttpResponse.json({
      status: true,
      result: { id: ANALYSIS_ID, name: "My Page", endpoint: { active: true, access: "public" } },
    })
  ),
  http.all(`https://api.tago.io/endpoint/${ANALYSIS_ID}/*`, async ({ request }) => {
    lastCall = await capture(request);
    const path = lastCall.url.pathname;

    if (path.endsWith("/json")) {
      return HttpResponse.json({ path, query: Object.fromEntries(lastCall.url.searchParams) });
    }
    if (path.endsWith("/bad-json")) {
      return new HttpResponse("{nope", { headers: { "content-type": "application/json" } });
    }
    if (path.endsWith("/page")) {
      return new HttpResponse("<h1>hi</h1>", { headers: { "content-type": "text/html; charset=utf-8" } });
    }
    if (path.endsWith("/redirect")) {
      return new HttpResponse(null, { status: 302, headers: { location: "/endpoint/thanks" } });
    }
    if (path.endsWith("/missing")) {
      return HttpResponse.json({ status: false, message: "Not Found" }, { status: 404 });
    }
    if (path.endsWith("/empty")) {
      return new HttpResponse(null, { status: 204 });
    }
    return HttpResponse.json({ ok: true });
  }),
];

describe("Resources analysis endpoint", () => {
  const server = setupServer(...handlers);

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    lastCall = null;
    lastEditBody = null;
  });

  afterAll(() => {
    server.close();
  });

  const resources = new Resources({ token: "test-token", region: "us-e1" });

  describe("listEndpoints", () => {
    test("returns id, name and url, sending the token", async () => {
      const result = await resources.analysis.listEndpoints();

      expect(result).toEqual([
        { id: ANALYSIS_ID, name: "My Page", url: `https://api.tago.io/endpoint/${ANALYSIS_ID}` },
      ]);
      expect(lastCall?.headers.get("token")).toBe("test-token");
    });
  });

  describe("endpoint field", () => {
    test("edit sends a partial endpoint", async () => {
      const changes: AnalysisEditInfo = { endpoint: { active: true } };
      await resources.analysis.edit(ANALYSIS_ID, changes);

      expect(lastEditBody).toEqual({ endpoint: { active: true } });
    });

    test("info exposes the endpoint settings", async () => {
      const info: AnalysisInfo = await resources.analysis.info(ANALYSIS_ID);

      expect(info.endpoint).toEqual({ active: true, access: "public" });
    });
  });

  describe("callEndpoint", () => {
    test("defaults to GET on the Endpoint root", async () => {
      const result = await resources.analysis.callEndpoint(ANALYSIS_ID);

      expect(lastCall?.method).toBe("GET");
      expect(lastCall?.url.pathname).toBe(`/endpoint/${ANALYSIS_ID}/`);
      expect(lastCall?.headers.get("token")).toBe("test-token");
      expect(result).toMatchObject({ status: 200, body: { ok: true } });
    });

    test("builds the path, repeats array query keys and parses JSON", async () => {
      const result = await resources.analysis.callEndpoint(ANALYSIS_ID, {
        path: "/json",
        query: { x: 1, tag: ["a", "b"], flag: true },
      });

      expect(lastCall?.url.pathname).toBe(`/endpoint/${ANALYSIS_ID}/json`);
      expect(lastCall?.url.searchParams.getAll("tag")).toEqual(["a", "b"]);
      expect(lastCall?.url.searchParams.get("x")).toBe("1");
      expect(lastCall?.url.searchParams.get("flag")).toBe("true");
      expect(result.status).toBe(200);
      expect(result.headers["content-type"]).toContain("application/json");
      expect(result.body).toEqual({ path: `/endpoint/${ANALYSIS_ID}/json`, query: { x: "1", tag: "b", flag: "true" } });
    });

    test("accepts a path without the leading slash and encodes segments", async () => {
      await resources.analysis.callEndpoint(ANALYSIS_ID, { path: "a b/json" });

      expect(lastCall?.url.pathname).toBe(`/endpoint/${ANALYSIS_ID}/a%20b/json`);
    });

    test("refuses . and .. segments", async () => {
      await expect(resources.analysis.callEndpoint(ANALYSIS_ID, { path: "/../analysis" })).rejects.toThrow(
        "Invalid Endpoint path"
      );
      await expect(resources.analysis.callEndpoint(ANALYSIS_ID, { path: "/a/./b" })).rejects.toThrow(
        "Invalid Endpoint path"
      );
    });

    test("sends an object body as JSON", async () => {
      await resources.analysis.callEndpoint(ANALYSIS_ID, { method: "POST", body: { a: 1 } });

      expect(lastCall?.method).toBe("POST");
      expect(lastCall?.headers.get("content-type")).toBe("application/json");
      expect(JSON.parse(lastCall?.body || "")).toEqual({ a: 1 });
    });

    test("sends a string body as is, keeping the given content type", async () => {
      await resources.analysis.callEndpoint(ANALYSIS_ID, {
        method: "POST",
        body: "a=1",
        headers: { "content-type": "application/x-www-form-urlencoded", "x-custom": "yes" },
      });

      expect(lastCall?.body).toBe("a=1");
      expect(lastCall?.headers.get("content-type")).toBe("application/x-www-form-urlencoded");
      expect(lastCall?.headers.get("x-custom")).toBe("yes");
    });

    test("refuses a body on GET and HEAD", async () => {
      await expect(resources.analysis.callEndpoint(ANALYSIS_ID, { body: { a: 1 } })).rejects.toThrow(
        "cannot have a body"
      );
      await expect(resources.analysis.callEndpoint(ANALYSIS_ID, { method: "HEAD", body: "x" })).rejects.toThrow(
        "cannot have a body"
      );
    });

    test("returns text for non-JSON responses", async () => {
      const result = await resources.analysis.callEndpoint(ANALYSIS_ID, { path: "/page" });

      expect(result.status).toBe(200);
      expect(result.headers["content-type"]).toBe("text/html; charset=utf-8");
      expect(result.body).toBe("<h1>hi</h1>");
    });

    test("keeps the text when a JSON response does not parse", async () => {
      const result = await resources.analysis.callEndpoint(ANALYSIS_ID, { path: "/bad-json" });

      expect(result.body).toBe("{nope");
    });

    test("returns non-2xx answers instead of throwing", async () => {
      const result = await resources.analysis.callEndpoint(ANALYSIS_ID, { path: "/missing" });

      expect(result.status).toBe(404);
      expect(result.body).toEqual({ status: false, message: "Not Found" });
    });

    test("returns an empty body for 204", async () => {
      const result = await resources.analysis.callEndpoint(ANALYSIS_ID, { path: "/empty" });

      expect(result).toMatchObject({ status: 204, body: "" });
    });

    test("does not follow redirects", async () => {
      const result = await resources.analysis.callEndpoint(ANALYSIS_ID, { path: "/redirect" });

      expect(result.status).toBe(302);
      expect(result.headers.location).toBe("/endpoint/thanks");
    });
  });
});
