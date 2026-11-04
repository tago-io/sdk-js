import parseAIGeneration from "./parseAIGeneration.ts";

describe("parseAIGeneration", () => {
  test("parses a generation job from a callback scope", () => {
    const job = parseAIGeneration<{ severity: string }>({
      id: "job-1",
      status: "completed",
      created_at: "2026-11-04T12:00:00.000Z",
      completed_at: "2026-11-04T12:00:02.000Z",
      model: { slug: "default", effort: "auto" },
      output: { text: "{}", json: { severity: "high" }, messages: [] },
      billing: { mode: "free" },
    });

    expect(job?.created_at).toBeInstanceOf(Date);
    expect(job?.completed_at).toBeInstanceOf(Date);
    expect(job?.output?.json?.severity).toBe("high");
  });

  test("returns null for other scope items", () => {
    expect(parseAIGeneration({ id: "record-1", variable: "temperature", value: 21 })).toBeNull();
    expect(parseAIGeneration(undefined)).toBeNull();
    expect(parseAIGeneration({ id: "x", status: "done", billing: {} })).toBeNull();
    expect(parseAIGeneration({ id: "x", status: "completed", billing: null })).toBeNull();
  });
});
