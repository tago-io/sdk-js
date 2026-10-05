import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";

import { Resources } from "../../src/modules.ts";

const DEVICE_ID = "6125a6a1d4c8a300120a1234";

let lastSearchParams: URLSearchParams | null = null;

const handlers = [
  http.get(`https://api.tago.io/device/${DEVICE_ID}/statistics`, ({ request }) => {
    lastSearchParams = new URL(request.url).searchParams;
    return HttpResponse.json({
      status: true,
      result: [
        { time: "2026-09-01T00:00:00.000Z", device_input: 1250, device_output: 8730 },
        { time: "2026-09-02T00:00:00.000Z", device_input: 2480 },
      ],
    });
  }),
];

describe("Resources devices statistics", () => {
  const server = setupServer(...handlers);

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    lastSearchParams = null;
  });

  afterAll(() => {
    server.close();
  });

  test("sends the query params and parses time as a Date", async () => {
    const resources = new Resources({ token: "test", region: "us-e1" });

    const result = await resources.devices.statistics(DEVICE_ID, {
      periodicity: "day",
      start_date: "2026-09-01",
      end_date: "2026-09-30",
      timezone: "America/Sao_Paulo",
    });

    expect(lastSearchParams?.get("periodicity")).toBe("day");
    expect(lastSearchParams?.get("start_date")).toBe("2026-09-01");
    expect(lastSearchParams?.get("end_date")).toBe("2026-09-30");
    expect(lastSearchParams?.get("timezone")).toBe("America/Sao_Paulo");

    expect(result).toEqual([
      { time: new Date("2026-09-01T00:00:00.000Z"), device_input: 1250, device_output: 8730 },
      { time: new Date("2026-09-02T00:00:00.000Z"), device_input: 2480 },
    ]);
  });

  test("works without query params", async () => {
    const resources = new Resources({ token: "test", region: "us-e1" });

    const result = await resources.devices.statistics(DEVICE_ID);

    expect(lastSearchParams?.toString()).toBe("");
    expect(result).toHaveLength(2);
    expect(result[0].time).toBeInstanceOf(Date);
  });
});
