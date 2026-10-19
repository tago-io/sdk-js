import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";

import { Services } from "../../src/modules.ts";

let receivedBody: Record<string, unknown> = {};

const handlers = [
  http.post("https://api.tago.io/analysis/services/email-smtp/send", async ({ request }) => {
    receivedBody = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ status: true, result: "Email sent" });
  }),
];

describe("SMTP service", () => {
  const server = setupServer(...handlers);

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  test("joins to, cc, and bcc arrays into comma-separated strings", async () => {
    const smtp = new Services({ token: "test", region: "us-e1" }).smtp;
    const result = await smtp.send({
      to: ["a@example.com", "b@example.com"],
      cc: ["c@example.com", "d@example.com"],
      bcc: ["e@example.com"],
      subject: "Report",
      message: "Hello",
      smtp_secret: "{}",
    });

    expect(result).toBe("Email sent");
    expect(receivedBody.to).toBe("a@example.com,b@example.com");
    expect(receivedBody.cc).toBe("c@example.com,d@example.com");
    expect(receivedBody.bcc).toBe("e@example.com");
  });

  test("keeps string cc and bcc unchanged and omits them when absent", async () => {
    const smtp = new Services({ token: "test", region: "us-e1" }).smtp;
    await smtp.send({ to: "a@example.com", cc: "c@example.com", subject: "Report", message: "Hi", smtp_secret: "{}" });

    expect(receivedBody.cc).toBe("c@example.com");
    expect(receivedBody).not.toHaveProperty("bcc");
  });
});
