import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import Dashboards from "./Dashboards.ts";

const requests: { method: string; url: URL; body: unknown }[] = [];

const record = async (request: Request): Promise<void> => {
  const text = request.method === "GET" ? "" : await request.text();
  requests.push({ method: request.method, url: new URL(request.url), body: text ? JSON.parse(text) : undefined });
};

const server = setupServer(
  http.post("https://api.tago.io/dashboard/dash-id-123/generate", async ({ request }) => {
    await record(request);
    return HttpResponse.json({ status: true, result: { id: "dash-id-123" } });
  }),
  http.get("https://api.tago.io/dashboard/dash-id-123/run-users", async ({ request }) => {
    await record(request);
    return HttpResponse.json({
      status: true,
      result: [{ id: "run-user-1", name: "Ana", email: "ana@example.com", has_dashboard: true }],
    });
  }),
  http.put("https://api.tago.io/dashboard/dash-id-123", async ({ request }) => {
    await record(request);
    return HttpResponse.json({ status: true, result: "Successfully Updated" });
  })
);

const dashboards = new Dashboards({ token: "test-token" });

describe("Dashboards AI resource", () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    requests.length = 0;
  });
  afterAll(() => server.close());

  it("generates the owner setup without run_user", async () => {
    const result = await dashboards.generate("dash-id-123", { prompt: "Show temperature" });

    expect(result).toEqual({ id: "dash-id-123" });
    expect(requests[0].method).toBe("POST");
    expect(requests[0].url.pathname).toBe("/dashboard/dash-id-123/generate");
    expect(requests[0].body).toEqual({ prompt: "Show temperature" });
  });

  it("generates a run user's dashboard with history", async () => {
    await dashboards.generate("dash-id-123", {
      prompt: "Add humidity",
      history: [
        { role: "user", content: "Show temperature" },
        { role: "assistant", content: "Added a temperature chart." },
      ],
      run_user: "run-user-1",
    });

    expect(requests[0].body).toEqual({
      prompt: "Add humidity",
      history: [
        { role: "user", content: "Show temperature" },
        { role: "assistant", content: "Added a temperature chart." },
      ],
      run_user: "run-user-1",
    });
  });

  it("lists run users with the query string", async () => {
    const result = await dashboards.listRunUsers("dash-id-123", { search: "ana", page: 2, amount: 50 });

    expect(result).toEqual([{ id: "run-user-1", name: "Ana", email: "ana@example.com", has_dashboard: true }]);
    expect(requests[0].method).toBe("GET");
    expect(Object.fromEntries(requests[0].url.searchParams)).toEqual({ search: "ana", page: "2", amount: "50" });
  });

  it("does not retry generate after a 5xx", async () => {
    let hits = 0;
    server.use(
      http.post("https://api.tago.io/dashboard/dash-id-123/generate", () => {
        hits += 1;
        return HttpResponse.json({ status: false, message: "Sorry, Internal Error" }, { status: 500 });
      })
    );

    await expect(dashboards.generate("dash-id-123", { prompt: "Show temperature" })).rejects.toBeDefined();
    expect(hits).toBe(1);
  });

  it("passes per_user and ai_instructions through edit", async () => {
    await dashboards.edit("dash-id-123", { per_user: true, ai_instructions: "Use metric units" });

    expect(requests[0].method).toBe("PUT");
    expect(requests[0].body).toEqual({ per_user: true, ai_instructions: "Use metric units" });
  });
});
