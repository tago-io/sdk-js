import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { Device } from "../../src/modules";

const handlers = [
  http.post("https://api.tago.io/data", () => {
    return HttpResponse.json({
      status: true,
      result: "1 Data Added",
    });
  }),
];

describe("Device class", () => {
  const server = setupServer(...handlers);

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  test("Sending data", async () => {
    const device = new Device({ token: "test", region: "us-e1" });
    const result = await device.sendData({ variable: "aa" });

    expect(result).toBe("1 Data Added");
  });
});
