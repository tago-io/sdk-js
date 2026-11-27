import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";

import {
  type AnalysisCreateInfo,
  type AnalysisEditInfo,
  type AnalysisInfo,
  type AnalysisMqttTryResult,
  Resources,
} from "../../src/modules.ts";

const ANALYSIS_ID = "6125a6a1d4c8a300120a1234";
const OLD_SERVER_ANALYSIS_ID = "6125a6a1d4c8a300120a9999";
const TOKEN = "at0123456789abcdef0123456789abcdef";

let lastBody: unknown = null;
let lastURL: URL | null = null;
let lastHeaders: Headers | null = null;

const handlers = [
  http.post("https://api.tago.io/analysis", async ({ request }) => {
    lastBody = await request.json();
    return HttpResponse.json({ status: true, result: { id: ANALYSIS_ID, token: "analysis-token" } });
  }),
  http.put(`https://api.tago.io/analysis/${ANALYSIS_ID}`, async ({ request }) => {
    lastBody = await request.json();
    return HttpResponse.json({ status: true, result: "Successfully Updated" });
  }),
  http.get(`https://api.tago.io/analysis/${ANALYSIS_ID}`, () =>
    HttpResponse.json({
      status: true,
      result: {
        id: ANALYSIS_ID,
        name: "Room sensors",
        mqtt: {
          active: true,
          events: { connect: true, subscribe: false, unsubscribe: false },
          host: "mqtt.endpoint.example.com",
          ports: { plain: 1883, secure: 8883 },
        },
      },
    })
  ),
  http.get(`https://api.tago.io/analysis/${OLD_SERVER_ANALYSIS_ID}`, () =>
    HttpResponse.json({ status: true, result: { id: OLD_SERVER_ANALYSIS_ID, name: "Legacy" } })
  ),
  http.post(`https://api.tago.io/analysis/${ANALYSIS_ID}/mqtt/try`, async ({ request }) => {
    lastBody = await request.json();
    lastHeaders = request.headers;
    return HttpResponse.json({ status: true, result: { outcome: "ran", duration_ms: 42 } });
  }),
  http.post("https://api.tago.io/serviceauth", async ({ request }) => {
    lastBody = await request.json();
    return HttpResponse.json({
      status: true,
      result: { token: TOKEN, name: "Room sensors", profile: "6125a6a1d4c8a300120a5678" },
    });
  }),
  http.get("https://api.tago.io/serviceauth", ({ request }) => {
    lastURL = new URL(request.url);
    return HttpResponse.json({
      status: true,
      result: [{ name: "Room sensors", token: TOKEN, analysis: ANALYSIS_ID, created_at: "2026-11-27T00:00:00.000Z" }],
    });
  }),
];

describe("Resources analysis MQTT Endpoint", () => {
  const server = setupServer(...handlers);

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    lastBody = null;
    lastURL = null;
    lastHeaders = null;
  });

  afterAll(() => {
    server.close();
  });

  const resources = new Resources({ token: "test-token", region: "us-e1" });

  describe("mqtt field", () => {
    test("create sends the mqtt settings", async () => {
      const analysis: AnalysisCreateInfo = { name: "Room sensors", runtime: "luau-rt2026", mqtt: { active: true } };
      await resources.analysis.create(analysis);

      expect(lastBody).toMatchObject({ mqtt: { active: true } });
    });

    test("edit sends a partial mqtt", async () => {
      const changes: AnalysisEditInfo = { mqtt: { events: { subscribe: true } } };
      await resources.analysis.edit(ANALYSIS_ID, changes);

      expect(lastBody).toEqual({ mqtt: { events: { subscribe: true } } });
    });

    test("info exposes the mqtt state with the broker address", async () => {
      const info: AnalysisInfo = await resources.analysis.info(ANALYSIS_ID);

      expect(info.mqtt).toEqual({
        active: true,
        events: { connect: true, subscribe: false, unsubscribe: false },
        host: "mqtt.endpoint.example.com",
        ports: { plain: 1883, secure: 8883 },
      });
    });

    test("info has no mqtt on a server without the MQTT Endpoint", async () => {
      const info: AnalysisInfo = await resources.analysis.info(OLD_SERVER_ANALYSIS_ID);

      expect(info.mqtt).toBeUndefined();
    });
  });

  describe("tryMqtt", () => {
    test("posts the message and returns the outcome", async () => {
      const result: AnalysisMqttTryResult = await resources.analysis.tryMqtt(ANALYSIS_ID, {
        topic: "sensors/room-1",
        payload: '{"temperature":21.5}',
        qos: 0,
      });

      expect(lastBody).toEqual({ topic: "sensors/room-1", payload: '{"temperature":21.5}', qos: 0 });
      expect(lastHeaders?.get("token")).toBe("test-token");
      expect(result).toEqual({ outcome: "ran", duration_ms: 42 });
    });

    test("leaves qos out when not given", async () => {
      await resources.analysis.tryMqtt(ANALYSIS_ID, { topic: "sensors/room-1", payload: "hi" });

      expect(lastBody).toEqual({ topic: "sensors/room-1", payload: "hi" });
    });
  });

  describe("service authorization", () => {
    test("tokenCreate sends the bound analysis", async () => {
      const result = await resources.serviceAuthorization.tokenCreate({
        name: "Room sensors",
        permission: "full",
        analysis: ANALYSIS_ID,
      });

      expect(lastBody).toEqual({ name: "Room sensors", permission: "full", analysis: ANALYSIS_ID });
      expect(result.token).toBe(TOKEN);
    });

    test("tokenList filters by analysis and returns it", async () => {
      const result = await resources.serviceAuthorization.tokenList({
        fields: ["name", "token", "analysis"],
        filter: { analysis: ANALYSIS_ID },
      });

      expect(lastURL?.searchParams.get("filter[analysis]")).toBe(ANALYSIS_ID);
      expect(result[0].analysis).toBe(ANALYSIS_ID);
      expect(result[0].created_at).toBeInstanceOf(Date);
    });
  });
});
