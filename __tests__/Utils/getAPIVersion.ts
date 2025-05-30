import type http from "node:http";
import type { AddressInfo } from "node:net";
import express, { type Express } from "express";
import { Utils } from "../../src/modules";

jest.setTimeout(3000);

describe("Get Api version", () => {
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

  test("Sending data", async () => {
    let url: string;
    app.get("/status", (req, res) => {
      url = req.url;
      res.send({ status: true, result: { version: "x.x.x" } });
    });

    const result = await Utils.getAPIVersion("env");

    expect(result).toBe("x.x.x");
    expect(url).toBe("/status");
  });
});
