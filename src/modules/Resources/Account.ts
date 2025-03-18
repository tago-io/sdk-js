import { GenericToken } from "../../common/common.types";
import TagoIOModule, { doRequestParams, GenericModuleParams } from "../../common/TagoIOModule";
import { Regions, RegionsObj } from "../../regions";
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
   * Gets all account information
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
   * Edit account
   * @param accountObj Account data to edit
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
   * Delete account
   */
  public async delete(): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/account",
      method: "DELETE",
    });

    return result;
  }

  /**
   * Generates and retrieves a new token for the account
   * @param tokenParams Token data
   * @param region TagoIO Region Server [default usa-1]
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
   * Retrieve list of profiles for login and do Login
   * @param credentials Credentials
   * @param region TagoIO Region Server [default usa-1]
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
   * Send password recover email
   * @param email E-mail to recovery
   * @param region TagoIO Region Server [default usa-1]
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
   * Change account password
   * @param password New Password
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
   * Create new TagoIO account
   * @param createParams New account details
   * @param region TagoIO Region Server [default usa-1]
   */
  public static async create(createParams: AccountCreateInfo, region?: Regions | RegionsObj): Promise<string> {
    const params: doRequestParams = {
      path: `/account`,
      method: "POST",
      body: createParams,
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   *  Re-send confirmation account email
   * @param email E-mail address
   * @param region TagoIO Region Server [default usa-1]
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
   * Confirm account creation
   * @param token Confirmation token
   * @param region TagoIO Region Server [default usa-1]
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
   * @param credentials Credentials
   * @param typeOTP authenticator, sms or email
   */
  public static async requestLoginPINCode(
    credentials: { email: string; password: string },
    typeOTP: OTPType,
    region?: Regions | RegionsObj
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
   * Enable OTP for a given OTP Type.
   * You will be requested to confirm the operation with a pin code.
   * @param credentials Credentials
   * @param typeOTP authenticator, sms or email
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
   * Enable OTP for a given OTP Type
   * @param credentials Credentials
   * @param typeOTP authenticator, sms or email
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
   * Confirm OTP enabling process for a given OTP Type
   * @param credentials Credentials
   * @param typeOTP authenticator, sms or email
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
   * @returns Success message.
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
   * @returns Success message.
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
