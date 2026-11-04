import type { GenericID } from "../../common/common.types.ts";

/** A conversation turn, in the same shape the AI chat uses. */
type AIGenerateMessage =
  | {
      type: "user";
      message: string;
      /**
       * Up to 5 TagoIO Files URLs from this profile, each up to 5 MB: images
       * (`.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`) or text (`.txt`, `.csv`,
       * cut at 100 KB). A request attaches at most 5 distinct files across all
       * its messages. The Analysis needs a **File** / **Access** policy for
       * each file, unless the file is public.
       */
      files?: string[];
    }
  | { type: "assistant"; message: string };

/** Thinking effort. A model that does not support the level rejects the request. */
type AIGenerateEffort = "auto" | "none" | "low" | "medium" | "high" | "xhigh" | "max";

interface AIGenerateParams {
  /**
   * Conversation so far. The last message must be a `user` message.
   * A string is sent as a single user message. Messages and `system` together
   * are limited to about 16,000 tokens.
   */
  messages: AIGenerateMessage[] | string;
  /** System instructions for the model. */
  system?: string;
  /**
   * Catalog model to run. When omitted, the profile's chat model is used,
   * then the free default model.
   */
  model?: string;
  /** Thinking effort. When omitted, the API resolves it for the model. */
  effort?: AIGenerateEffort;
  /** Marks `model` as a custom wire id for the profile's own provider key, not a catalog slug. */
  custom?: boolean;
  /**
   * Ask for JSON output that follows a JSON schema (max 32 KB). The parsed
   * object is returned in `output.json`. The API does not check it against
   * the schema, so validate it before use.
   */
  response_format?: {
    type: "json_schema";
    /** Letters, digits, `_` and `-`, up to 64 characters. */
    name: string;
    schema: Record<string, unknown>;
  };
  /** Maximum output tokens, a positive integer up to 18,000. When omitted, the AI chat default applies. */
  max_output_tokens?: number;
  /**
   * Seconds to wait for the result before the API answers with a pending job.
   * Defaults to 10; values above 25 wait 25. Must not be negative. Use `0` to
   * return right away.
   */
  wait?: number;
  /**
   * Analysis to run when the job reaches a final status, with the job as
   * `scope[0]`. The Analysis token must hold `run_analysis` on it, or the
   * request is rejected before the job starts.
   *
   * If the API process running the job stops (for example, during a deploy),
   * the job reads as `failed` with `interrupted` and the callback does not
   * run. Keep a fallback, such as reading the job with `getGeneration`, when
   * the result matters.
   */
  callback?: { analysis: GenericID };
}

interface AIGenerateOptions {
  /**
   * Key that makes the request safe to retry: a repeated key returns the
   * existing job instead of starting a new one, even if the body differs.
   * Letters, digits, `_` and `-`, up to 64 characters. Kept for 1 hour.
   * When omitted, the SDK generates one per call so its own retries never
   * start a second generation.
   */
  idempotencyKey?: string;
}

interface AIGenerateAndWaitOptions extends AIGenerateOptions {
  /**
   * Seconds to wait for the generation to finish. At the timeout, the job is
   * returned as it is, possibly still `queued` or `in_progress`. Defaults to
   * 25, which leaves room inside the default 30 s Analysis timeout. `0` checks
   * once without waiting. Must be finite.
   */
  timeout?: number;
}

type AIGenerationStatus = "queued" | "in_progress" | "completed" | "incomplete" | "failed";

type AIGenerationErrorCode = "provider_error" | "model_unavailable" | "interrupted" | "timeout";

/** The model a generation runs on. */
interface AIGenerationModel {
  /** Catalog slug, or `custom:<id>` for a custom model on the profile's own provider key. */
  slug: string;
  /** Resolved thinking effort. */
  effort: string;
}

/**
 * A generation job. `T` types `output.json` when `response_format` was given.
 * The API does not check the output against the schema, and neither does the
 * SDK, so `T` is what you expect, not a guarantee.
 */
interface AIGeneration<T = unknown> {
  /** Job ID, for `getGeneration`. */
  id: GenericID;
  /** `queued` or `in_progress` while running; `completed`, `incomplete` or `failed` once finished. */
  status: AIGenerationStatus;
  created_at: Date;
  /** Set when the job finishes. Absent while it runs and on jobs that read as `interrupted`. */
  completed_at?: Date;
  /** Present from the start. `null` only when the model could not be resolved (`model_unavailable`). */
  model: AIGenerationModel | null;
  output?: {
    text: string;
    /**
     * Present on `completed` jobs that gave `response_format`: the parsed
     * object, or `null` when the model did not return valid JSON.
     */
    json?: T | null;
    /** Assistant turns, ready to append to your `messages` history. */
    messages: { type: "assistant"; message: string }[];
  };
  incomplete_details?: { reason: "max_output_tokens" | "content_filter" };
  error?: { code: AIGenerationErrorCode; message: string };
  /**
   * How the generation is billed. A finished wallet job that was charged also
   * includes the amount, as a decimal string, and usually its currency. Token
   * counts are never returned.
   */
  billing: {
    mode: "free" | "wallet" | "byok";
    charged?: string;
    currency?: string;
  };
  /**
   * The callback requested with the job. Inside the callback Analysis it still
   * reads `pending`: the API records `sent` or `failed` after the run.
   */
  callback?: { analysis: GenericID; status: "pending" | "sent" | "failed" };
}

export type {
  AIGenerateAndWaitOptions,
  AIGenerateEffort,
  AIGenerateMessage,
  AIGenerateOptions,
  AIGenerateParams,
  AIGeneration,
  AIGenerationErrorCode,
  AIGenerationModel,
  AIGenerationStatus,
};
