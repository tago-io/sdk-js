import { GenericID, GenericToken } from "../../common/common.types";
import TagoIOModule, { doRequestParams, GenericModuleParams } from "../../common/TagoIOModule";
import { Regions } from "../../regions";
import { NotificationInfo, NotificationQuery } from "../Account/notifications.types";
import { OTPType } from "../Account/account.types";
import dateParser from "../Utils/dateParser";
import {
  RunNotificationInfo,
  RunUserCreateInfo,
  RunUserCreate,
  RunUserInfo,
  RunUserLogin,
  RunUserLoginResponse,
  RunUserCredentials,
} from "./runUser.types";
import SDB from "./SDB";

class RunUser extends TagoIOModule<GenericModuleParams> {
  /**
   * Get Run user info
   * @param tagoIORunURL TagoIO Run url without http
   */
  public async info(tagoIORunURL: string): Promise<RunUserInfo> {
    let result = await this.doRequest<RunUserInfo>({
      path: `/run/${tagoIORunURL}/info`,
      method: "GET",
    });

    result = dateParser(result, ["created_at"]);

    return result;
  }

  /**
   * Create new TagoIO Run User (Anonymous)
   * @param tagoIORunURL TagoIO Run url without http
   * @param newUserObj New user data
   * @param region TagoIO Region Server [default usa-1]
   */
  public static async create(
    tagoIORunURL: string,
    newUserObj: RunUserCreateInfo,
    region?: Regions
  ): Promise<RunUserCreate> {
    const params: doRequestParams = {
      path: `/run/${tagoIORunURL}/signup`,
      method: "POST",
      body: newUserObj,
    };

    const result = await TagoIOModule.doRequestAnonymous<RunUserCreate>(params, region);

    return result;
  }

  /**
   * Edit Run user info
   * @param tagoIORunURL TagoIO Run url without http
   * @param userChangesObj Data to change in user
   */
  public async edit(tagoIORunURL: string, userChangesObj: Partial<RunUserInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/${tagoIORunURL}/info`,
      method: "PUT",
      body: userChangesObj,
    });

    return result;
  }

  /**
   * Login at TagoIO Run as user (Anonymous)
   * @param tagoIORunURL TagoIO Run url without http
   * @param credentialsObj Run user credentials
   * @param region TagoIO Region Server [default usa-1]
   */
  public static async login(
    tagoIORunURL: string,
    credentialsObj: RunUserLogin,
    region?: Regions
  ): Promise<RunUserLoginResponse> {
    const params: doRequestParams = {
      path: `/run/${tagoIORunURL}/login`,
      method: "POST",
      body: credentialsObj,
    };

    let result = await TagoIOModule.doRequestAnonymous<RunUserLoginResponse>(params, region);

    result = dateParser(result, ["expire_date"]);

    return result;
  }

  /**
   * Confirm User on TagoIO Run (Anonymous)
   * @param tagoIORunURL TagoIO Run url without http
   * @param token TagoIO Run user token
   * @param region TagoIO Region Server [default usa-1]
   */
  public static async confirmUser(tagoIORunURL: string, token: GenericToken, region?: Regions): Promise<string> {
    const params: doRequestParams = {
      path: `/run/${tagoIORunURL}/confirm/${token}`,
      method: "GET",
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   * Sends a password recover e-mail
   * @param tagoIORunURL TagoIO Run url without http
   * @param email Run user email to recover the password
   * @param region TagoIO Region Server [default usa-1]
   */
  public static async passwordRecover(tagoIORunURL: string, email: string, region?: Regions): Promise<string> {
    const params: doRequestParams = {
      path: `/run/${tagoIORunURL}/passwordreset/${email}`,
      method: "GET",
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   * Change password using token of the password recover.
   * @param tagoIORunURL TagoIO Run url without http
   * @param password New password
   */
  public async passwordChange(tagoIORunURL: string, password: string): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/${tagoIORunURL}/passwordreset`,
      method: "POST",
      body: {
        password,
      },
    });

    return result;
  }

  /**
   * List notifications.
   * @param tagoIORunURL TagoIO Run url without http
   */
  public async notificationList(tagoIORunURL: string, queryObj?: NotificationQuery): Promise<NotificationInfo[]> {
    let result = await this.doRequest<NotificationInfo[]>({
      path: `/run/${tagoIORunURL}/notification`,
      method: "GET",
      params: queryObj,
    });
    result = result.map((data) => dateParser(data, ["created_at"]));

    return result;
  }

  /**
   * Mark notification as read
   * @param tagoIORunURL TagoIO Run url without http
   * @param notificationIDs array of notification ids or a single id
   */
  public async notificationMarkRead(tagoIORunURL: string, notificationIDs: GenericID | GenericID[]): Promise<string> {
    if (!Array.isArray(notificationIDs)) {
      notificationIDs = [notificationIDs];
    }

    const result = await this.doRequest<string>({
      path: `/run/${tagoIORunURL}/notification`,
      method: "PUT",
      body: {
        notification_ids: notificationIDs,
        read: true,
      },
    });

    return result;
  }

  /**
   * Mark notification as unread
   * @param tagoIORunURL TagoIO Run url without http
   * @param notificationIDs array of notification ids or a single id
   */
  public async notificationMarkUnread(tagoIORunURL: string, notificationIDs: GenericID | GenericID[]): Promise<string> {
    if (!Array.isArray(notificationIDs)) {
      notificationIDs = [notificationIDs];
    }

    const result = await this.doRequest<string>({
      path: `/run/${tagoIORunURL}/notification`,
      method: "PUT",
      body: {
        notification_ids: notificationIDs,
        read: false,
      },
    });

    return result;
  }

  /**
   * Mark all notifications as read
   * @param tagoIORunURL TagoIO Run url without http
   */
  public async notificationMarkAllRead(tagoIORunURL: string): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/${tagoIORunURL}/notification/markallread`,
      method: "PUT",
    });

    return result;
  }
  /**
   * Trigger notification button
   * @param tagoIORunURL TagoIO Run url without http
   * @param notificationID TagoIO Run notification id
   * @param buttonID Notification button id
   */
  public async notificationButton(tagoIORunURL: string, notificationID: GenericID, buttonID: GenericID): Promise<any> {
    const result = await this.doRequest<any>({
      path: `/run/${tagoIORunURL}/notification/${notificationID}/${buttonID}`,
      method: "PUT",
    });

    return result;
  }

  /**
   * Delete notification
   * @param tagoIORunURL TagoIO Run url without http
   * @param notificationID TagoIO Run notification id
   */
  public async notificationDelete(tagoIORunURL: string, notificationID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/${tagoIORunURL}/notification/${notificationID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Request the PIN Code for a given OTP Type.
   * @param credentials Credentials
   * @param typeOTP authenticator, sms or email
   */
  public static async requestLoginPINCode(
    tagoIORunURL: string,
    credentials: RunUserCredentials,
    typeOTP: OTPType
  ): Promise<string> {
    const result = await this.doRequestAnonymous<string>({
      path: `/run/${tagoIORunURL}/login/otp`,
      method: "POST",
      body: { ...credentials, otp_type: typeOTP },
    });

    return result;
  }

  /**
   * Enable OTP for a given OTP Type.
   * You will be requested to confirm the operation with a pin code.
   * @param credentials Credentials
   * @param typeOTP authenticator, sms or email
   */
  public async enableOTP(tagoIORunURL: string, credentials: RunUserCredentials, typeOTP: OTPType): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/${tagoIORunURL}/otp/${typeOTP}/enable`,
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
  public async disableOTP(tagoIORunURL: string, credentials: RunUserCredentials, typeOTP: OTPType): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/${tagoIORunURL}/otp/${typeOTP}/disable`,
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
  public async confirmOTP(tagoIORunURL: string, pinCode: string, typeOTP: OTPType): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/${tagoIORunURL}/otp/${typeOTP}/confirm`,
      method: "POST",
      body: {
        pin_code: pinCode,
      },
    });

    return result;
  }

  public SDB = new SDB(this.params);
}

export default RunUser;
