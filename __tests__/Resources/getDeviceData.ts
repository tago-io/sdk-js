import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";

import { Resources } from "../../src/modules.ts";

const DEVICE_ID = "6125a6a1d4c8a300120a1234";

let apiResult: unknown = null;

const handlers = [
  http.get(`https://api.tago.io/device/${DEVICE_ID}/data`, () => {
    return HttpResponse.json({ status: true, result: apiResult });
  }),
];

describe("Resources devices getDeviceData", () => {
  const server = setupServer(...handlers);

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  test("returns an empty array when avg has no data in range", async () => {
    apiResult = null;
    const resources = new Resources({ token: "test", region: "us-e1" });

    const result = await resources.devices.getDeviceData(DEVICE_ID, {
      variable: "wind_speed",
      query: "avg",
      start_date: "2026-09-10T05:00:00.000Z",
      end_date: "2026-09-10T14:00:00.000Z",
    });

    expect(result).toEqual([]);
  });

  test("wraps a numeric result in a single item", async () => {
    apiResult = 95.92;
    const resources = new Resources({ token: "test", region: "us-e1" });

    const result = await resources.devices.getDeviceData(DEVICE_ID, {
      variable: "wind_speed",
      query: "avg",
      start_date: "2026-09-20",
    });

    expect(result).toHaveLength(1);
    expect(result[0].value).toBe(95.92);
  });
});
