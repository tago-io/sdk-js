import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { Authorization } from "../../src/modules.ts";

const handlers = [
  http.get("https://api.tago.io/info", ({ request }) => {
    const url = new URL(request.url);

    let id = "test-id";
    if (url.searchParams.get("details") === "true") {
      id = "test-id-with-details";
    }

    return HttpResponse.json({
      status: true,
      result: {
        id,
      },
    });
  }),
];

describe("Authorization class", () => {
  const server = setupServer(...handlers);

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  test("info", async () => {
    const authorization = new Authorization({ token: "test", region: "us-e1" });
    const result = await authorization.info();

    expect(result).toMatchObject({ id: "test-id" });
  });

  test("info with details", async () => {
    const authorization = new Authorization({
      token: "test",
      region: "us-e1",
      details: true,
    });
    const result = await authorization.info();

    expect(result).toMatchObject({ id: "test-id-with-details" });
  });
});
