import type http from "node:http";
import type { AddressInfo } from "node:net";
import express, { type Express } from "express";
import { Authorization } from "../../src/modules";

jest.setTimeout(3000);

describe("Authorization class", () => {
  let app: Express;
  let service: http.Server;
  beforeEach((done) => {
    const startServer = () => {
      app = express();
      app.use(express.json());
      service = app.listen(0);
      process.env.TAGOIO_API = `http://localhost:${(service.address() as AddressInfo).port}`;
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

  test("info", async () => {
    let url: string | undefined;
    let body: object | undefined;
    let query: object | undefined;
    app.get("/info", (req, res) => {
      url = req.path;
      body = req.body;
      query = req.query;
      res.send({ status: true, result: { id: "test" } });
    });

    const authorization = new Authorization({ token: "test", region: "env" });
    const result = await authorization.info();

    expect(result).toMatchObject({ id: "test" });
    expect(url).toBe("/info");
    expect(query).toMatchObject({});
    expect(body).toBeUndefined();
  });

  test("info with details", async () => {
    let url: string | undefined;
    let body: object | undefined;
    let query: object | undefined;
    app.get("/info", (req, res) => {
      url = req.url;
      body = req.body;
      query = req.query;
      res.send({ status: true, result: { id: "test" } });
    });

    const authorization = new Authorization({ token: "test", region: "env", details: true });
    await authorization.info();

    expect(query).toMatchObject({ details: "true" });
  });
});
