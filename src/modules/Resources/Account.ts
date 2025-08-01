import TagoIOModule, { type doRequestParams, type GenericModuleParams } from "../../common/TagoIOModule";
import type { GenericToken } from "../../common/common.types";
import type { Regions, RegionsObj } from "../../regions";
import dateParser from "../Utils/dateParser";
import type {
  AccountCreateInfo,
  AccountInfo,
  LoginCredentials,
  LoginResponse,
  OTPType,
  TokenCreateInfo,
} from "./account.types";

class Account extends TagoIOModule<GenericModuleParams> {
  /**
   * Gets all account information.
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Account** / **Access Account Information** in Access Management.
   * ```typescript
   * const accountInfo = await Resources.account.info();
   * console.log(accountInfo); // { active: true, blocked: false, created_at: 2023-02-21T15:17:35.759Z, ... }
   * ```
   */
  public async info(): Promise<AccountInfo> {
    let result = await this.doRequest<AccountInfo>({
      path: "/account",
      method: "GET",
    });

    result = dateParser(result, ["created_at", "updated_at", "last_login"]);

    if (result.options) result.options = dateParser(result.options, ["last_whats_new"]);

    return result;
  }

  /**
   * Edit account.
   *
   * @example
   * ```typescript
   * const account = new Account({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await account.edit({ name: "New Name" });
   * console.log(result); // Account Successfully Updated
   * ```
   */
  public async edit(accountObj: Partial<AccountInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/account",
      method: "PUT",
      body: accountObj,
    });

    return result;
  }

  /**
   * Delete account.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/210-deleting-your-account} Deleting Your Account
   *
   * @example
   * ```typescript
   * const account = new Account({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await account.delete();
   * console.log(result);
   * ```typescript
   */
  public async delete(): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/account",
      method: "DELETE",
    });

    return result;
  }

  /**
   * Generates and retrieves a new token for the account.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/495-account-token} Account Token
   *
   * @example
   * ```typescript
   * const account = new Account({ token: "YOUR-PROFILE-TOKEN" });
   * const token = await account.tokenCreate({ name: "New Token" });
   * console.log(token);
   * ```typescript
   */
  public static async tokenCreate(
    tokenParams: TokenCreateInfo,
    region?: Regions | RegionsObj
  ): Promise<{ token: GenericToken }> {
    const params: doRequestParams = {
      path: "/account/profile/token",
      method: "POST",
      body: tokenParams,
    };

    const result = await TagoIOModule.doRequestAnonymous<{ token: GenericToken }>(params, region);

    return result;
  }

  /**
   * Retrieve list of profiles for login and do Login.
   *
   * @example
   * ```typescript
   * const account = new Account({ token: "YOUR-PROFILE-TOKEN" });
   * const loginResponse = await account.login({ email: "user@example.com", password: "password" });
   * console.log(loginResponse);
   * ```
   */
  public static async login(credentials: LoginCredentials, region?: Regions | RegionsObj): Promise<LoginResponse> {
    const params: doRequestParams = {
      path: "/account/login",
      method: "POST",
      body: credentials,
    };

    const result = await TagoIOModule.doRequestAnonymous<LoginResponse>(params, region);

    return result;
  }

  /**
   * Send password recover email.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/209-resetting-my-password} Resetting My Password
   *
   * @example
   * ```typescript
   * const account = new Account({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await account.passwordRecover("user@example.com");
   * console.log(result);
   * ```
   */
  public static async passwordRecover(email: string, region?: Regions | RegionsObj): Promise<string> {
    const params: doRequestParams = {
      path: `/account/passwordreset/${email}`,
      method: "GET",
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   * Change account password.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/209-resetting-my-password} Resetting My Password
   * TODO: not working
   *
   * @example
   * ```typescript
   * const account = new Account({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await account.passwordChange("newPassword");
   * console.log(result);
   * ```
   */
  public async passwordChange(password: string): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/account/passwordreset",
      method: "POST",
      body: {
        password,
      },
    });

    return result;
  }

  /**
   * Create new TagoIO account.
   *
   * @example
   * ```typescript
   * const account = new Account({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await account.create({ name: "New Account", email: "user@example.com", password: "password" });
   * console.log(result);
   * ```
   */
  public static async create(createParams: AccountCreateInfo, region?: Regions | RegionsObj): Promise<string> {
    const params: doRequestParams = {
      path: "/account",
      method: "POST",
      body: createParams,
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   * Re-send confirmation account email.
   *
   * @example
   * ```typescript
   * const account = new Account({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await account.resendConfirmation("user@example.com");
   * console.log(result);
   * ```
   */
  public static async resendConfirmation(email: string, region?: Regions | RegionsObj): Promise<string> {
    const params: doRequestParams = {
      path: `/account/resend_confirmation/${email}`,
      method: "GET",
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   * Confirm account creation.
   *
   * @example
   * ```typescript
   * const account = new Account({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await account.confirmAccount("confirmationToken");
   * console.log(result);
   * ```
   */
  public static async confirmAccount(token: GenericToken, region?: Regions | RegionsObj): Promise<string> {
    const params: doRequestParams = {
      path: `/account/confirm/${token}`,
      method: "GET",
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   * Request the PIN Code for a given OTP Type.
   *
   * @example
   * ```typescript
   * const account = new Account({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await account.requestLoginPINCode({ email: "user@example.com", password: "password" }, "sms");
   * console.log(result);
   * ```
   */
  public static async requestLoginPINCode(
    credentials: { email: string; password: string },
    typeOTP: OTPType,
    region?: Regions | RegionsObj
  ): Promise<string> {
    const params: doRequestParams = {
      path: "/account/login/otp",
      method: "POST",
      body: { ...credentials, otp_type: typeOTP },
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   * Enable OTP for a given OTP Type.
   * You will be requested to confirm the operation with a pin code.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/526-two-factor-authentication} Two-factor Authentication (2FA)
   *
   * @example
   * If receive an error "Authorization Denied", check policy in Access Management.
   * ```typescript
   * const account = new Account({ token: "YOUR-PROFILE-TOKEN" });
   * const result = account.enableOTP({ email: "user@example.com", password: "password" }, "sms");
   * console.log(result);
   * ```typescript
   */
  public async enableOTP(credentials: { email: string; password: string }, typeOTP: OTPType): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/account/otp/${typeOTP}/enable`,
      method: "POST",
      body: credentials,
    });

    return result;
  }

  /**
   * Disable OTP for a given OTP Type.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/526-two-factor-authentication} Two-factor Authentication (2FA)
   *
   * @example
   * ```typescript
   * const account = new Account({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await account.disableOTP({ email: "user@example.com", password: "password" }, "sms");
   * console.log(result);
   * ```
   */
  public async disableOTP(credentials: { email: string; password: string }, typeOTP: OTPType): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/account/otp/${typeOTP}/disable`,
      method: "POST",
      body: credentials,
    });

    return result;
  }

  /**
   * Confirm OTP enabling process for a given OTP Type.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/526-two-factor-authentication} Two-factor Authentication (2FA)
   *
   * @example
   * ```typescript
   * const account = new Account({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await account.confirmOTP("123456", "sms");
   * console.log(result);
   * ```
   */
  public async confirmOTP(pinCode: string, typeOTP: OTPType): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/account/otp/${typeOTP}/confirm`,
      method: "POST",
      body: {
        pin_code: pinCode,
      },
    });

    return result;
  }

  /**
   * Accept a team member invitation to become a profile's team member.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/106-sharing-your-profile} for Team Management - Sharing your profile
   *
   * @example
   * ```typescript
   * account = new Account({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await account.acceptTeamInvitation("invitationToken");
   * console.log(result);
   * ```
   */
  public static async acceptTeamInvitation(token: string, region?: Regions | RegionsObj): Promise<string> {
    const result = await TagoIOModule.doRequestAnonymous<string>(
      {
        path: `/profile/team/accept/${token}`,
        method: "GET",
      },
      region
    );

    return result;
  }

  /**
   * Decline a team member invitation to become a profile's team member.
   *
   * @example
   * ```typescript
   * const account = new Account({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await account.declineTeamInvitation("invitationToken");
   * console.log(result);
   * ```
   */
  public static async declineTeamInvitation(token: string, region?: Regions | RegionsObj): Promise<string> {
    const result = await TagoIOModule.doRequestAnonymous<string>(
      {
        path: `/profile/team/decline/${token}`,
        method: "GET",
      },
      region
    );

    return result;
  }
}

export default Account;
