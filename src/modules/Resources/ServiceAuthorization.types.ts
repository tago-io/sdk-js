import type { GenericID } from "../../types";

/**
 * Token used on TagoIO, string with 34 characters
 */
type GenericToken = string;

type TokenCreateResponse = {
  token: GenericToken;
  name: string;
  profile: GenericID;
  /** [Optional] Verification code to validate middleware requests. */
  additional_parameters?: string;
};

export type { GenericToken, TokenCreateResponse };
