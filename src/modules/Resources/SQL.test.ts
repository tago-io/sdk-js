import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import SQL from "./SQL.ts";

const QUERY_ROW = {
  id: "sql-id-123",
  name: "Latest temperature",
  tags: [{ key: "audience", value: "dashboard" }],
  created_at: "2026-07-01T12:00:00.000Z",
  updated_at: "2026-07-02T12:00:00.000Z",
};

const EXECUTE_RESULT = {
  columns: [
    { name: "variable", type: "string" },
    { name: "value", type: "number" },
  ],
  rows: [{ variable: "temperature", value: 41.2 }],
  row_count: 1,
  execution_ms: 12,
  served_from_cache: false,
};

const server = setupServer(
  http.get("https://api.tago.io/sql", () => HttpResponse.json({ status: true, result: [QUERY_ROW] })),
  http.post("https://api.tago.io/sql", () => HttpResponse.json({ status: true, result: QUERY_ROW })),
  http.get("https://api.tago.io/sql/tables", () =>
    HttpResponse.json({
      status: true,
      result: {
        tables: [{ function: "device", label: "Device Data", columns: [] }],
        resources: { devices: [], entities: [] },
      },
    })
  ),
  http.get("https://api.tago.io/sql/sql-id-123", () => HttpResponse.json({ status: true, result: QUERY_ROW })),
  http.put("https://api.tago.io/sql/sql-id-123", () => HttpResponse.json({ status: true, result: QUERY_ROW })),
  http.delete("https://api.tago.io/sql/sql-id-123", () =>
    HttpResponse.json({ status: true, result: { id: "sql-id-123" } })
  ),
  http.get("https://api.tago.io/sql/sql-id-123/version/1", () =>
    HttpResponse.json({
      status: true,
      result: { query: "SELECT 1", params: [], created_at: "2026-07-01T12:00:00.000Z" },
    })
  ),
  http.post("https://api.tago.io/sql/sql-id-123/execute", () =>
    HttpResponse.json({ status: true, result: EXECUTE_RESULT })
  )
);

const sql = new SQL({ token: "test-token" });

describe("SQL resource", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("lists queries and parses dates", async () => {
    const result = await sql.list({ fields: ["id", "name", "tags"] });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("sql-id-123");
    expect(result[0].created_at).toBeInstanceOf(Date);
  });

  it("creates a query", async () => {
    const result = await sql.create({
      name: "Latest temperature",
      query: "SELECT variable, value FROM device($1) AS d LIMIT 10",
      params: [{ key: "$1", value: "my-device-id" }],
    });

    expect(result.id).toBe("sql-id-123");
  });

  it("fetches query info", async () => {
    const result = await sql.info("sql-id-123");

    expect(result.name).toBe("Latest temperature");
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it("edits a query", async () => {
    const result = await sql.edit("sql-id-123", {
      name: "Latest temperature",
      query: "SELECT 1",
    });

    expect(result.id).toBe("sql-id-123");
  });

  it("deletes a query", async () => {
    const result = await sql.delete("sql-id-123");

    expect(result).toEqual({ id: "sql-id-123" });
  });

  it("fetches a version snapshot", async () => {
    const result = await sql.getVersion("sql-id-123", 1);

    expect(result.query).toBe("SELECT 1");
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it("executes a stored query", async () => {
    const result = await sql.execute("sql-id-123", { params: [{ key: "$1", value: "my-device-id" }] });

    expect(result.row_count).toBe(1);
    expect(result.served_from_cache).toBe(false);
  });

  it("fetches the tables catalog", async () => {
    const result = await sql.tables({ filter: "sensor" });

    expect(result.tables[0].function).toBe("device");
  });
});
