import express, { Express } from "express";
import http from "http";
import { Authorization } from "../../src/modules";
import { AddressInfo } from "net";

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
    let url: string;
    let body: object;
    let query: object;
    app.get("/info", (req, res) => {
      url = req.path;
      body = req.body;
      query = req.query;
      res.send({ status: true, result: { id: "test" } });
    });

    const authorization = new Authorization({ token: "test", region: "env" });
    const result = await authorization.info();
    console.log("url", url);

    expect(result).toMatchObject({ id: "test" });
    expect(url).toBe("/info");
    expect(query).toMatchObject({});
    expect(body).toMatchObject({});
  });

  test("info with details", async () => {
    let url: string;
    let body: object;
    let query: object;
    app.get("/info", (req, res) => {
      url = req.url;
      body = req.body;
      query = req.query;
      res.send({ status: true, result: { id: "test" } });
    });

    const authorization = new Authorization({ token: "test", region: "env", details: true });
    const result = await authorization.info();

    expect(query).toMatchObject({ details: "true" });
  });
});
