import type http from "node:http";
import type { AddressInfo } from "node:net";
import express, { type Express } from "express";
import { Device } from "../../src/modules";

describe("Device class", () => {
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
    let body: object;
    app.post("/data", (req, res) => {
      url = req.url;
      body = req.body;
      res.send({ status: true, result: "1 Data Added" });
    });

    const device = new Device({ token: "test", region: "env" });
    const result = await device.sendData({ variable: "aa" });

    expect(result).toBe("1 Data Added");
    expect(url).toBe("/data");
    expect(body).toMatchObject([{ variable: "aa" }]);
  });
});
