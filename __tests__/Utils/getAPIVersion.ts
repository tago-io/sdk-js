import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { Utils } from "../../src/modules.ts";

const handlers = [
  http.get("https://api.tago.io/status", () => {
    return HttpResponse.json({
      status: true,
      result: {
        version: "x.x.x",
      },
    });
  }),
];

describe("Get Api version", () => {
  const server = setupServer(...handlers);

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  test("Sending data", async () => {
    const result = await Utils.getAPIVersion("us-e1");

    expect(result).toBe("x.x.x");
  });
});
