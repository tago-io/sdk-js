import express, { Express } from "express";
import http from "http";
import { Network } from "../../src/modules";
import { AddressInfo } from "net";

jest.setTimeout(3000);

describe("Network class", () => {
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

  test("Resolving token without authorization", async () => {
    let url: string;
    let body: object;
    app.get(`/integration/network/resolve/:serieNumber`, (req, res) => {
      url = req.url;
      body = req.body;
      res.send({ status: true, result: "token" });
    });

    const connector = new Network({ token: "test", region: "env" });
    const result = await connector.resolveToken("serieNumber");

    expect(result).toBe("token");
    expect(url).toBe("/integration/network/resolve/serieNumber");
    expect(body || {}).toMatchObject({});
  });

  test("Resolving token with authorization", async () => {
    let url: string;
    let body: object;
    let query: object;
    app.get(`/integration/network/resolve/:serieNumber/:authorization`, (req, res) => {
      url = req.url;
      body = req.body;
      query = req.query;
      res.send({ status: true, result: "token" });
    });

    const connector = new Network({ token: "test", region: "env" });
    const result = await connector.resolveToken("serieNumber", "authorization");

    expect(result).toBe("token");
    expect(url).toBe("/integration/network/resolve/serieNumber/authorization");
    expect(query).toMatchObject({});
    expect(body || {}).toMatchObject({});
  });

  test("Resolving token with detail true", async () => {
    let query: object;
    app.get(`/integration/network/resolve/:serieNumber`, (req, res) => {
      query = req.query;
      res.send({ status: true, result: "token" });
    });

    const connector = new Network({ token: "test", region: "env", details: true });
    const result = await connector.resolveToken("serieNumber");

    expect(result).toBe("token");
    expect(query).toMatchObject({ details: "true" });
  });
});
