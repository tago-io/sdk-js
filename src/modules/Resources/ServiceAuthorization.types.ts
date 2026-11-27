import type { Query, TokenData, TokenDataList } from "../../common/common.types.ts";
import type { GenericID } from "../../types.ts";

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

type TokenCreateInfo = TokenData & {
  /**
   * [Optional] ID of a Luau Analysis of the profile with the MQTT Endpoint: devices connecting with this
   * authorization run its code. Set at creation only; it cannot change later. For paid plans (Lite, Pro, and Max;
   * TagoDeploy instances always have it): on a Free account it is refused with
   * `"The MQTT Endpoint needs a paid plan. Upgrade to use it."`.
   */
  analysis?: GenericID;
};

type TokenListItem = TokenDataList & {
  /** ID of the Luau Analysis the authorization is bound to for the MQTT Endpoint, or `null`. */
  analysis: GenericID | null;
};

interface TokenListQuery extends Query<
  TokenListItem,
  "name" | "permission" | "serie_number" | "verification_code" | "created_at"
> {}

export type { GenericToken, TokenCreateResponse, TokenCreateInfo, TokenListItem, TokenListQuery };
