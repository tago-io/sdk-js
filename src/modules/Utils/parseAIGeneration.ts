import type { AIGeneration } from "../Resources/ai.types.ts";
import dateParser from "./dateParser.ts";

const STATUSES = new Set(["queued", "in_progress", "completed", "incomplete", "failed"]);

/**
 * Reads an AI generation job from a callback Analysis scope.
 *
 * When a job started with `callback` reaches a final status, the API runs the
 * callback Analysis with the job as `scope[0]`. If the API process running
 * the job stops, the callback does not run. Returns the job with its dates
 * parsed, or `null` when the value is not a generation job, for example when
 * the Analysis also runs from other triggers.
 *
 * @example
 * ```typescript
 * import { Analysis, Utils } from "@tago-io/sdk";
 * import type { TagoContext } from "@tago-io/sdk";
 *
 * async function handleReport(context: TagoContext, scope: unknown[]) {
 *   const job = Utils.parseAIGeneration(scope[0]);
 *   if (job?.status === "completed") {
 *     console.log(job.output?.text);
 *   }
 * }
 *
 * Analysis.use(handleReport);
 * ```
 */
function parseAIGeneration<T = unknown>(value: unknown): AIGeneration<T> | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const job = value as Partial<AIGeneration<T>>;
  if (
    typeof job.id !== "string" ||
    !STATUSES.has(job.status as string) ||
    typeof job.billing !== "object" ||
    job.billing === null
  ) {
    return null;
  }

  return dateParser(job as AIGeneration<T>, ["created_at", "completed_at"]);
}

export default parseAIGeneration;
