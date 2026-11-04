import { delay, HttpResponse, http } from "msw";
import { setupServer } from "msw/node";

import AI from "./AI.ts";

// ? A fake clock: Date.now reads it, and sleep advances it instead of waiting.
const clock = vi.hoisted(() => ({ now: 1_000_000, sleeps: [] as number[] }));
vi.mock("../../common/sleep.ts", () => ({
  default: (ms: number) => {
    clock.sleeps.push(ms);
    clock.now += ms;
    return Promise.resolve();
  },
}));

const POST_URL = "https://api.tago.io/ai/generate";
const GET_URL = "https://api.tago.io/ai/generate/job-1";

const job = {
  id: "job-1",
  status: "completed",
  created_at: "2026-11-04T12:00:00.000Z",
  completed_at: "2026-11-04T12:00:02.000Z",
  model: { slug: "default", effort: "auto" },
  output: { text: "hi", messages: [{ type: "assistant", message: "hi" }] },
  billing: { mode: "wallet", charged: "0.0042", currency: "USD" },
};

const pending = {
  id: job.id,
  status: "in_progress",
  created_at: job.created_at,
  model: job.model,
  billing: { mode: "wallet" },
};

const ok = (result: unknown, status = 200) => HttpResponse.json({ status: true, result }, { status });
const apiError = (message: string, status: number) => HttpResponse.json({ status: false, message }, { status });
const bodyOf = async (request: Request) => (await request.json()) as Record<string, unknown>;

/** Moves the fake clock forward, as if a request took that long. */
const advance = (seconds: number) => {
  clock.now += seconds * 1000;
};

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(() => {
  clock.now = 1_000_000;
  clock.sleeps = [];
  vi.spyOn(Date, "now").mockImplementation(() => clock.now);
});
afterEach(() => {
  server.resetHandlers();
  vi.restoreAllMocks();
});
afterAll(() => server.close());

describe("AI.generate", () => {
  test("posts the params with a generated idempotency key and parses the job dates", async () => {
    let body: Record<string, unknown> = {};
    server.use(
      http.post(POST_URL, async ({ request }) => {
        body = await bodyOf(request);
        return ok(job);
      })
    );

    const params = { messages: [{ type: "user" as const, message: "hello" }], wait: 0 };
    const result = await new AI({ token: "token" }).generate(params);

    const { idempotency_key, ...rest } = body;
    expect(rest).toEqual(params);
    expect(idempotency_key).toMatch(/^[A-Za-z0-9_-]{1,64}$/);
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.completed_at).toBeInstanceOf(Date);
  });

  test("sends a string as a single user message", async () => {
    let body: Record<string, unknown> = {};
    server.use(
      http.post(POST_URL, async ({ request }) => {
        body = await bodyOf(request);
        return ok(job);
      })
    );

    await new AI({ token: "token" }).generate({ messages: "hello" });

    expect(body.messages).toEqual([{ type: "user", message: "hello" }]);
  });

  test.each([
    ["a supplied", "my-key"],
    ["a generated", undefined],
  ])("keeps %s idempotency key across its own retries", async (_label, idempotencyKey) => {
    const keys: unknown[] = [];
    server.use(
      http.post(POST_URL, async ({ request }) => {
        keys.push((await bodyOf(request)).idempotency_key);
        return keys.length === 1 ? new HttpResponse(null, { status: 503 }) : ok(job);
      })
    );

    await new AI({ token: "token" }).generate({ messages: "hello" }, { idempotencyKey });

    expect(keys).toHaveLength(2);
    expect(keys[1]).toBe(keys[0]);
    expect(keys[0]).toEqual(idempotencyKey ?? expect.stringMatching(/^[A-Za-z0-9_-]{1,64}$/));
  });

  test("rejects with the API message on a 4xx, without retrying", async () => {
    let calls = 0;
    server.use(
      http.post(POST_URL, () => {
        calls += 1;
        return apiError("Too many AI generations running for this profile (max 3)", 429);
      })
    );

    await expect(new AI({ token: "token" }).generate({ messages: "hello" })).rejects.toBe(
      "Too many AI generations running for this profile (max 3)"
    );
    expect(calls).toBe(1);
  });
});

describe("AI.getGeneration", () => {
  test("reads the job and parses its dates", async () => {
    server.use(http.get(GET_URL, () => ok(job)));

    const result = await new AI({ token: "token" }).getGeneration("job-1");

    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.completed_at).toBeInstanceOf(Date);
  });

  test("rejects with the API message for a missing job", async () => {
    server.use(http.get(GET_URL, () => apiError("AI generation not found", 404)));

    await expect(new AI({ token: "token" }).getGeneration("job-1")).rejects.toBe("AI generation not found");
  });
});

describe("AI.generateAndWait", () => {
  test("waits on the POST, then polls every 5 s until the job finishes", async () => {
    let postWait: unknown;
    let gets = 0;
    server.use(
      http.post(POST_URL, async ({ request }) => {
        postWait = (await bodyOf(request)).wait;
        advance(25);
        return ok(pending, 202);
      }),
      http.get(GET_URL, () => {
        gets += 1;
        return ok(gets < 3 ? pending : job);
      })
    );

    const result = await new AI({ token: "token" }).generateAndWait({ messages: "hello" }, { timeout: 60 });

    expect(postWait).toBe(25);
    expect(clock.sleeps).toEqual([5000, 5000, 5000]);
    expect(gets).toBe(3);
    expect(result.status).toBe("completed");
  });

  test("returns the running job at the timeout, after a last read at the deadline", async () => {
    let gets = 0;
    server.use(
      http.post(POST_URL, () => {
        advance(25);
        return ok(pending, 202);
      }),
      http.get(GET_URL, () => {
        gets += 1;
        return ok(pending);
      })
    );

    const result = await new AI({ token: "token" }).generateAndWait({ messages: "hello" }, { timeout: 32 });

    expect(clock.sleeps).toEqual([5000, 2000]);
    expect(gets).toBe(2);
    expect(result.status).toBe("in_progress");
  });

  test("cuts the POST wait to the timeout, rounded down to 0.1 s", async () => {
    let postWait: unknown;
    server.use(
      http.post(POST_URL, async ({ request }) => {
        postWait = (await bodyOf(request)).wait;
        return ok(job);
      })
    );

    await new AI({ token: "token" }).generateAndWait({ messages: "hello" }, { timeout: 7.55 });

    expect(postWait).toBe(7.5);
  });

  test("by default sends one POST with wait 25 and no GET", async () => {
    let postWait: unknown;
    server.use(
      http.post(POST_URL, async ({ request }) => {
        postWait = (await bodyOf(request)).wait;
        advance(25);
        return ok(pending, 202);
      })
    );

    const result = await new AI({ token: "token" }).generateAndWait({ messages: "hello" });

    expect(postWait).toBe(25);
    expect(clock.sleeps).toEqual([]);
    expect(result.status).toBe("in_progress");
  });

  test("with timeout 0, sends one POST with wait 0 and does not poll", async () => {
    let postWait: unknown;
    server.use(
      http.post(POST_URL, async ({ request }) => {
        postWait = (await bodyOf(request)).wait;
        return ok(pending, 202);
      })
    );

    const result = await new AI({ token: "token" }).generateAndWait({ messages: "hello" }, { timeout: 0 });

    expect(postWait).toBe(0);
    expect(clock.sleeps).toEqual([]);
    expect(result.status).toBe("in_progress");
  });

  test.each(["completed", "incomplete", "failed"])("returns a %s job from the POST without polling", async (status) => {
    server.use(http.post(POST_URL, () => ok({ ...pending, status })));

    const result = await new AI({ token: "token" }).generateAndWait({ messages: "hello" }, { timeout: 60 });

    expect(result.status).toBe(status);
    expect(clock.sleeps).toEqual([]);
  });

  test("retries a POST that failed in transit with the same key, backing off", async () => {
    const keys: unknown[] = [];
    server.use(
      http.post(POST_URL, async ({ request }) => {
        keys.push((await bodyOf(request)).idempotency_key);
        if (keys.length === 1) {
          return new HttpResponse(null, { status: 502 });
        }
        if (keys.length === 2) {
          return HttpResponse.error();
        }
        return ok(job);
      })
    );

    const result = await new AI({ token: "token" }).generateAndWait(
      { messages: "hello" },
      { idempotencyKey: "my-key" }
    );

    expect(keys).toEqual(["my-key", "my-key", "my-key"]);
    expect(clock.sleeps).toEqual([1000, 2000]);
    expect(result.status).toBe("completed");
  });

  test("retries a failed poll with a GET, not a new POST", async () => {
    let posts = 0;
    let gets = 0;
    server.use(
      http.post(POST_URL, () => {
        posts += 1;
        advance(25);
        return ok(pending, 202);
      }),
      http.get(GET_URL, () => {
        gets += 1;
        return gets === 1 ? new HttpResponse(null, { status: 503 }) : ok(job);
      })
    );

    const result = await new AI({ token: "token" }).generateAndWait({ messages: "hello" }, { timeout: 60 });

    expect(posts).toBe(1);
    expect(gets).toBe(2);
    expect(result.status).toBe("completed");
  });

  test("rejects at once when a poll gets a 4xx", async () => {
    let gets = 0;
    server.use(
      http.post(POST_URL, () => {
        advance(25);
        return ok(pending, 202);
      }),
      http.get(GET_URL, () => {
        gets += 1;
        return apiError("AI generation not found", 404);
      })
    );

    await expect(new AI({ token: "token" }).generateAndWait({ messages: "hello" }, { timeout: 60 })).rejects.toBe(
      "AI generation not found"
    );
    expect(gets).toBe(1);
  });

  test("stops retrying at the deadline and rejects with the transport error", async () => {
    let calls = 0;
    server.use(
      http.post(POST_URL, () => {
        calls += 1;
        advance(25);
        return new HttpResponse(null, { status: 502 });
      })
    );

    await expect(
      new AI({ token: "token" }).generateAndWait({ messages: "hello" }, { timeout: 25 })
    ).rejects.toMatchObject({ status: 502 });
    expect(calls).toBe(1);
  });

  test("limits a stalled request to the time left plus a short grace", async () => {
    server.use(
      http.post(POST_URL, async () => {
        await delay("infinite");
        return ok(job);
      })
    );

    // ? Real timers here: with no time left, the request may take only the 3 s grace.
    const started = performance.now();
    await expect(
      new AI({ token: "token" }).generateAndWait({ messages: "hello" }, { timeout: 0 })
    ).rejects.toMatchObject({ code: "TIMEOUT" });
    expect(performance.now() - started).toBeLessThan(5000);
  }, 10_000);

  test.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects timeout %s before calling the API",
    async (timeout) => {
      await expect(new AI({ token: "token" }).generateAndWait({ messages: "hello" }, { timeout })).rejects.toThrow(
        "timeout"
      );
    }
  );
});
