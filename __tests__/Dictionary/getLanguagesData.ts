import type http from "http";
import type { AddressInfo } from "net";
import express, { type Express } from "express";

import { Dictionary } from "../../src/modules";

describe("getLanguagesData", () => {
  let app: Express;
  let service: http.Server;
  let dictionary: Dictionary;
  let url: string | undefined;
  let body: object | undefined;

  const slug = "SLUG";
  const language = "en-US";

  beforeAll((done) => {
    dictionary = new Dictionary({ language: "en-US", token: "mockToken" });

    const startServer = () => {
      app = express();
      app.use(express.json());
      service = app.listen(0);
      process.env.TAGOIO_API = `http://localhost:${(service.address() as AddressInfo).port}`;

      app.get(`/dictionary/${slug}/${language}`, (req, res) => {
        url = req.url;
        body = req.body;
        res.send({
          status: true,
          result: {
            KEY1: "first value",
            KEY2: "second value",
          },
        });
      });

      done();
    };

    if (service) {
      service.close(startServer);
    } else {
      startServer();
    }
  });

  afterAll((done) => {
    service.close(done);
  });

  beforeEach(() => {
    url = undefined;
    body = undefined;
  });

  it("makes a request when applying the dictionary to a string with expressions", async () => {
    const result = await dictionary.applyToString(
      "This is a string with two dictionary expressions: #SLUG.KEY1# and #SLUG.KEY2#."
    );

    expect(result).toBe("This is a string with two dictionary expressions: first value and second value.");
    expect(url).toBe(`/dictionary/${slug}/${language}?fallback=true`);
    expect(body).toBeUndefined();
  });

  it("does not make a request if there's no dictionary expression in the string", async () => {
    const result = await dictionary.applyToString("This is a string with zero dictionary expressions.");

    expect(result).toBe("This is a string with zero dictionary expressions.");
    expect(url).toBeUndefined();
    expect(body).toBeUndefined();
  });
});
