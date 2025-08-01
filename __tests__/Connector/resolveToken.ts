import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { Network } from "../../src/modules.ts";

const handlers = [
  http.get("https://api.tago.io/integration/network/resolve/:serial_number", ({ request }) => {
    const url = new URL(request.url);

    let token = "token-without-auth";
    if (url.searchParams.get("details") === "true") {
      token = "token-with-details";
    }

    return HttpResponse.json({
      status: true,
      result: token,
    });
  }),

  http.get("https://api.tago.io/integration/network/resolve/:serial_number/:authorization", () => {
    return HttpResponse.json({
      status: true,
      result: "token-with-auth",
    });
  }),
];

describe("Network class", () => {
  const server = setupServer(...handlers);

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  test("Resolving token without authorization", async () => {
    const connector = new Network({ token: "test", region: "us-e1" });
    const result = await connector.resolveToken("serieNumber");

    expect(result).toBe("token-without-auth");
  });

  test("Resolving token with authorization", async () => {
    const connector = new Network({ token: "test", region: "us-e1" });
    const result = await connector.resolveToken("serieNumber", "authorization");

    expect(result).toBe("token-with-auth");
  });

  test("Resolving token with detail true", async () => {
    const connector = new Network({
      token: "test",
      region: "us-e1",
      details: true,
    });
    const result = await connector.resolveToken("serieNumber");

    expect(result).toBe("token-with-details");
  });
});
