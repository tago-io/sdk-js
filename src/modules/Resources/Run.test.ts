import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import Run from "./Run.ts";

const requests: { method: string; path: string; body: unknown }[] = [];

const server = setupServer(
  http.post("https://api.tago.io/run/users", async ({ request }) => {
    requests.push({ method: request.method, path: new URL(request.url).pathname, body: await request.json() });
    return HttpResponse.json({ status: true, result: { user: "user-id-123" } });
  }),
  http.post("https://api.tago.io/run/users/user-id-123/invite", async ({ request }) => {
    requests.push({ method: request.method, path: new URL(request.url).pathname, body: await request.json() });
    return HttpResponse.json({ status: true, result: "Invite sent" });
  })
);

const run = new Run({ token: "test-token" });

describe("Run resource", () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    requests.length = 0;
  });
  afterAll(() => server.close());

  it("creates a user with a generated password", async () => {
    const result = await run.userCreate({
      name: "John Doe",
      email: "john@example.com",
      timezone: "America/New_York",
      generate_password: true,
      send_email: "invite",
    });

    expect(result).toEqual({ user: "user-id-123" });
    expect(requests).toEqual([
      {
        method: "POST",
        path: "/run/users",
        body: {
          name: "John Doe",
          email: "john@example.com",
          timezone: "America/New_York",
          generate_password: true,
          send_email: "invite",
        },
      },
    ]);
  });

  it("resends the invite with an empty body when no template is given", async () => {
    const result = await run.userResendInvite("user-id-123");

    expect(result).toBe("Invite sent");
    expect(requests).toEqual([{ method: "POST", path: "/run/users/user-id-123/invite", body: {} }]);
  });

  it("resends the invite with a template", async () => {
    const result = await run.userResendInvite("user-id-123", { invite_template: "invite" });

    expect(result).toBe("Invite sent");
    expect(requests).toEqual([
      { method: "POST", path: "/run/users/user-id-123/invite", body: { invite_template: "invite" } },
    ]);
  });
});
