import { GenericToken } from "../../common/common.types";
import TagoIOModule, { doRequestParams, GenericModuleParams } from "../../common/TagoIOModule";
import { Regions } from "../../regions";
import dateParser from "../Utils/dateParser";
import {
  AccountCreateInfo,
  AccountInfo,
  LoginCredentials,
  LoginResponse,
  OTPType,
  TokenCreateInfo,
} from "./account.types";

class Account extends TagoIOModule<GenericModuleParams> {
  /**
   * @description Gets all account information.
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const accountInfo = await Resources.account.info();
   * console.log(accountInfo);
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
   * @description Edit account.
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.account.edit({ name: "New Name" });
   * console.log(result);
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
   * @description Delete account.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/210-deleting-your-account} Deleting Your Account
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.account.delete();
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
   * @description Generates and retrieves a new token for the account.
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
  public static async tokenCreate(tokenParams: TokenCreateInfo, region?: Regions): Promise<{ token: GenericToken }> {
    const params: doRequestParams = {
      path: "/account/profile/token",
      method: "POST",
      body: tokenParams,
    };

    const result = await TagoIOModule.doRequestAnonymous<{ token: GenericToken }>(params, region);

    return result;
  }

  /**
   * @description Retrieve list of profiles for login and do Login.
   *
   * @example
   * ```typescript
   * const account = new Account({ token: "YOUR-PROFILE-TOKEN" });
   * const loginResponse = await account.login({ email: "user@example.com", password: "password" });
   * console.log(loginResponse);
   * ```
   */
  public static async login(credentials: LoginCredentials, region?: Regions): Promise<LoginResponse> {
    const params: doRequestParams = {
      path: "/account/login",
      method: "POST",
      body: credentials,
    };

    const result = await TagoIOModule.doRequestAnonymous<LoginResponse>(params, region);

    return result;
  }

  /**
   * @description Send password recover email.
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
  public static async passwordRecover(email: string, region?: Regions): Promise<string> {
    const params: doRequestParams = {
      path: `/account/passwordreset/${email}`,
      method: "GET",
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   * @description Change account password.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/209-resetting-my-password} Resetting My Password
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.account.passwordChange("newPassword");
   * console.log(result);
   * ```
   */
  public async passwordChange(password: string): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/account/passwordreset`,
      method: "POST",
      body: {
        password,
      },
    });

    return result;
  }

  /**
   * @description Create new TagoIO account.
   *
   * @example
   * ```typescript
   * const account = new Account({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await account.create({ name: "New Account", email: "user@example.com", password: "password" });
   * console.log(result);
   * ```
   */
  public static async create(createParams: AccountCreateInfo, region?: Regions): Promise<string> {
    const params: doRequestParams = {
      path: `/account`,
      method: "POST",
      body: createParams,
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   * @description Re-send confirmation account email.
   *
   * @example
   * ```typescript
   * const account = new Account({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await account.resendConfirmation("user@example.com");
   * console.log(result);
   * ```
   */
  public static async resendConfirmation(email: string, region?: Regions): Promise<string> {
    const params: doRequestParams = {
      path: `/account/resend_confirmation/${email}`,
      method: "GET",
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   * @description Confirm account creation.
   *
   * @example
   * ```typescript
   * const account = new Account({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await account.confirmAccount("confirmationToken");
   * console.log(result);
   * ```
   */
  public static async confirmAccount(token: GenericToken, region?: Regions): Promise<string> {
    const params: doRequestParams = {
      path: `/account/confirm/${token}`,
      method: "GET",
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   * @description Request the PIN Code for a given OTP Type.
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
    region?: Regions
  ): Promise<string> {
    const params: doRequestParams = {
      path: `/account/login/otp`,
      method: "POST",
      body: { ...credentials, otp_type: typeOTP },
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   * @description Enable OTP for a given OTP Type.
   * You will be requested to confirm the operation with a pin code.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/526-two-factor-authentication} Two-factor Authentication (2FA)
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.account.enableOTP({ email: "user@example.com", password: "password" }, "sms");
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
   * @description Disable OTP for a given OTP Type.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/526-two-factor-authentication} Two-factor Authentication (2FA)
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.account.disableOTP({ email: "user@example.com", password: "password" }, "sms");
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
   * @description Confirm OTP enabling process for a given OTP Type.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/526-two-factor-authentication} Two-factor Authentication (2FA)
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.account.confirmOTP("123456", "sms");
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
   * @description Accept a team member invitation to become a profile's team member.
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
  public static async acceptTeamInvitation(token: string): Promise<string> {
    const result = await TagoIOModule.doRequestAnonymous<string>({
      path: `/profile/team/accept/${token}`,
      method: "GET",
    });

    return result;
  }

  /**
   * @description Decline a team member invitation to become a profile's team member.
   *
   * @example
   * ```typescript
   * const account = new Account({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await account.declineTeamInvitation("invitationToken");
   * console.log(result);
   * ```
   */
  public static async declineTeamInvitation(token: string): Promise<string> {
    const result = await TagoIOModule.doRequestAnonymous<string>({
      path: `/profile/team/decline/${token}`,
      method: "GET",
    });

    return result;
  }
}

export default Account;
