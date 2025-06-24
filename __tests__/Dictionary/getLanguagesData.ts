import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { Dictionary } from "../../src/modules";

const handlers = [
  http.get("https://api.tago.io/dictionary/:slug/:language", () => {
    return HttpResponse.json({
      status: true,
      result: {
        KEY1: "first value",
        KEY2: "second value",
      },
    });
  }),
];

describe("getLanguagesData", () => {
  let dictionary: Dictionary;

  const server = setupServer(...handlers);

  beforeAll(() => {
    dictionary = new Dictionary({ language: "en-US", token: "mockToken" });
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it("makes a request when applying the dictionary to a string with expressions", async () => {
    const result = await dictionary.applyToString(
      "This is a string with two dictionary expressions: #SLUG.KEY1# and #SLUG.KEY2#."
    );

    expect(result).toBe("This is a string with two dictionary expressions: first value and second value.");
  });

  it("does not make a request if there's no dictionary expression in the string", async () => {
    const result = await dictionary.applyToString("This is a string with zero dictionary expressions.");

    expect(result).toBe("This is a string with zero dictionary expressions.");
  });
});
