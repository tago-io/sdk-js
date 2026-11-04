import { nanoid } from "nanoid";
import type { GenericID, RequestConfig } from "../../common/common.types.ts";
import sleep from "../../common/sleep.ts";
import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule.ts";
import { isTransportError } from "../../infrastructure/apiRequest.ts";
import dateParser from "../Utils/dateParser.ts";
import type { AIGenerateAndWaitOptions, AIGenerateOptions, AIGenerateParams, AIGeneration } from "./ai.types.ts";

// ? The API holds a single request at most this long (25 s), which also leaves
// ? room inside the default 30 s Analysis timeout.
const MAX_WAIT_SECONDS = 25;
// ? Allowance on top of the time left, for the API to answer once its wait ends.
const REQUEST_GRACE_MS = 3000;
// ? First pause before generateAndWait re-sends a request that failed in
// ? transit; it doubles on each failure, up to the poll interval.
const RETRY_DELAY_MS = 1000;
// ? Pause between generateAndWait reads of a running job: the API's `Retry-After`.
const POLL_INTERVAL_MS = 5000;

function isFinished(job: AIGeneration): boolean {
  return job.status === "completed" || job.status === "incomplete" || job.status === "failed";
}

class AI extends TagoIOModule<GenericModuleParams> {
  /**
   * Generates a response with the profile's AI. Pure completion: no chat
   * history and no TagoIO tools. Requires an Analysis token.
   *
   * The API waits up to `wait` seconds (default 10, max 25). If the generation
   * finishes in time, the returned job has a final status (`completed`,
   * `incomplete` or `failed`). Otherwise it is still `queued` or `in_progress`.
   * Use {@link AI.generateAndWait} to always get the finished job, or set
   * `callback` to run an Analysis when it finishes.
   *
   * The request is rejected with the API's message when the profile already
   * runs 3 generations or used up its free monthly AI requests (429), when the
   * AI Wallet has no funds (402), or when the body is invalid (400).
   *
   * @example
   * If receive an error "Authorization Denied", check policy **AI** / **Access** for the Analysis in Access Management.
   * ```typescript
   * // Let another Analysis handle the result, with the job as its scope
   * await Resources.ai.generate({
   *   messages: "Write the weekly report for these readings: ...",
   *   wait: 0,
   *   callback: { analysis: "report-handler-analysis-id" },
   * });
   * ```
   */
  public async generate<T = unknown>(params: AIGenerateParams, options?: AIGenerateOptions): Promise<AIGeneration<T>> {
    return this.postGenerate<T>(params, options?.idempotencyKey || nanoid());
  }

  /**
   * Generates a response and waits up to `timeout` seconds (default 25) for
   * the generation to finish. Requires an Analysis token.
   *
   * Resolves with the job once its status is `completed`, `incomplete` or
   * `failed`. If it is still `queued` or `in_progress` at the timeout, resolves
   * with the job as it is: the generation keeps running on the API, and
   * {@link AI.getGeneration} reads it later by `job.id`.
   *
   * Each request is limited to the time left, and requests that fail in
   * transit are retried only while time remains, always with the same
   * idempotency key. The call returns within a few seconds of the timeout, and
   * a retry never starts a second generation. API rejections are not retried;
   * see {@link AI.generate}. For generations that may take longer than the
   * Analysis can run, use {@link AI.generate} with `callback`.
   *
   * @example
   * If receive an error "Authorization Denied", check policy **AI** / **Access** for the Analysis in Access Management.
   * ```typescript
   * const job = await Resources.ai.generateAndWait({
   *   system: "You summarize sensor readings in one sentence.",
   *   messages: "Readings from the last hour: 21.5C, 22.1C, 23.8C",
   * });
   * if (job.status === "queued" || job.status === "in_progress") {
   *   console.log(`Still running, check later: ${job.id}`);
   * } else {
   *   console.log(job.status, job.output?.text);
   * }
   * ```
   *
   * @example Structured output
   * ```typescript
   * const job = await Resources.ai.generateAndWait<{ severity: "low" | "high" }>({
   *   messages: "Classify: pump vibration at 12 mm/s",
   *   response_format: {
   *     type: "json_schema",
   *     name: "alert",
   *     schema: {
   *       type: "object",
   *       properties: { severity: { type: "string", enum: ["low", "high"] } },
   *       required: ["severity"],
   *     },
   *   },
   * });
   * // `json` is `null` when the model did not return JSON. The API does not
   * // check it against the schema, so validate it before use.
   * const severity = job.output?.json?.severity;
   * if (severity === "low" || severity === "high") {
   *   console.log(severity);
   * }
   * ```
   */
  public async generateAndWait<T = unknown>(
    params: Omit<AIGenerateParams, "wait">,
    options?: AIGenerateAndWaitOptions
  ): Promise<AIGeneration<T>> {
    const timeoutSeconds = options?.timeout ?? MAX_WAIT_SECONDS;
    if (!Number.isFinite(timeoutSeconds) || timeoutSeconds < 0) {
      throw new Error("generateAndWait timeout must be a finite number of seconds, 0 or more");
    }

    const idempotencyKey = options?.idempotencyKey || nanoid();
    const deadline = Date.now() + timeoutSeconds * 1000;
    const remainingMs = () => Math.max(deadline - Date.now(), 0);
    // ? Rounded down to 0.1 s so the POST never waits past the deadline.
    const waitSeconds = () => Math.floor(Math.min(remainingMs() / 1000, MAX_WAIT_SECONDS) * 10) / 10;
    // ? One attempt per request: this loop owns the retries, so it can stop at
    // ? the deadline instead of waiting through the SDK-wide backoff. The
    // ? request timeout keeps a stalled connection from outliving the deadline.
    const requestConfig = (): RequestConfig => ({
      attempts: 1,
      timeout: Math.min(remainingMs(), MAX_WAIT_SECONDS * 1000) + REQUEST_GRACE_MS,
    });

    let job: AIGeneration<T> | undefined;
    let retryDelay = RETRY_DELAY_MS;
    while (true) {
      try {
        job = job
          ? await this.fetchGeneration<T>(job.id, requestConfig())
          : await this.postGenerate<T>({ ...params, wait: waitSeconds() }, idempotencyKey, requestConfig());
        retryDelay = RETRY_DELAY_MS;
      } catch (error) {
        if (!isTransportError(error) || remainingMs() === 0) {
          throw error;
        }
        await sleep(Math.min(retryDelay, remainingMs()));
        retryDelay = Math.min(retryDelay * 2, POLL_INTERVAL_MS);
        continue;
      }

      if (isFinished(job) || remainingMs() === 0) {
        return job;
      }
      // ? GET answers at once, so pause between reads. The last pause ends at
      // ? the deadline, and the read after it returns the job as it stands.
      await sleep(Math.min(POLL_INTERVAL_MS, remainingMs()));
    }
  }

  /**
   * Gets a generation job started by {@link AI.generate}, as it stands. The
   * API answers right away; it does not wait for the job to finish. Jobs are
   * kept for 1 hour; a missing, expired, or other profile's job is rejected
   * (404). Requires an Analysis token.
   *
   * @example
   * If receive an error "Authorization Denied", check policy **AI** / **Access** for the Analysis in Access Management.
   * ```typescript
   * const job = await Resources.ai.getGeneration("generation-id");
   * console.log(job.status, job.output?.text);
   * ```
   */
  public async getGeneration<T = unknown>(generationID: GenericID): Promise<AIGeneration<T>> {
    return this.fetchGeneration<T>(generationID);
  }

  private async postGenerate<T>(
    params: AIGenerateParams,
    idempotencyKey: string,
    requestConfig?: RequestConfig
  ): Promise<AIGeneration<T>> {
    const messages =
      typeof params.messages === "string" ? [{ type: "user", message: params.messages }] : params.messages;

    const result = await this.doRequest<AIGeneration<T>>({
      path: "/ai/generate",
      method: "POST",
      body: { ...params, messages, idempotency_key: idempotencyKey },
      overwriteRequestConfig: requestConfig,
    });

    return dateParser(result, ["created_at", "completed_at"]);
  }

  private async fetchGeneration<T>(generationID: GenericID, requestConfig?: RequestConfig): Promise<AIGeneration<T>> {
    const result = await this.doRequest<AIGeneration<T>>({
      path: `/ai/generate/${generationID}`,
      method: "GET",
      overwriteRequestConfig: requestConfig,
    });

    return dateParser(result, ["created_at", "completed_at"]);
  }
}

export default AI;
