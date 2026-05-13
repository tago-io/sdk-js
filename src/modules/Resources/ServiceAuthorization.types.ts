import type { GenericID } from "../../types.ts";

/**
 * Token used on TagoIO for Service Authorization, string with 34 characters
 */
type ServiceAuthorizationToken = string;

type ServiceAuthorizationTokenCreateResponse = {
  token: ServiceAuthorizationToken;
  name: string;
  profile: GenericID;
  /** [Optional] Verification code to validate middleware requests. */
  additional_parameters?: string;
};

export type { ServiceAuthorizationToken, ServiceAuthorizationTokenCreateResponse };
