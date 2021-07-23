import { ExpireTimeOption, GenericID, GenericToken, Query, TagsObj } from "../../common/common.types";
import { NotificationButton, NotificationCreate } from "./notifications.types";

interface RunInfo {
  profile: GenericID;
  active: boolean;
  name: string;
  sub_title: string;
  url: string;
  email_domain: string | null;
  signup_method: string;
  favicon: string | null;
  logo: string | null;
  signup_logo: string | null;
  signup_logo_options: object;
  sidebar_buttons: {
    color: string;
    href: string;
    iconUrl: string;
    text: string;
    type: string;
  }[];
  signup_fields: {
    name: string;
    placeholder: string;
    required: boolean;
    type: string;
  }[];
  email_templates: {
    [email_template_key: string]: {
      subject: string;
      value: string;
    };
  };
  feature_devicewifisetup: {
    background_color: string;
    button_cancel_background_color: string;
    button_cancel_text_color: string;
    button_confirm_background_color: string;
    button_confirm_text_color: string;
    enabled: boolean;
    ip: string;
    language: string;
    name: string;
    port: string;
    protocol: string;
    text_color: string;
    translations: { [language: string]: object };
  };
  feature_geolocation: {
    buffer_size: number;
    device: string | null;
    enabled: boolean;
    middleware_url: string;
    minimum_distance: number;
    minimum_interval: number;
    target: string;
  };
  theme: { [option in ThemeOption]: string };
  integration: object;
  sso_saml_active: boolean;
  security: {
    otp: {
      authenticator: boolean;
      sms: boolean;
      email: boolean;
    };
  };
}

interface UserCreateInfo {
  name: string;
  email: string;
  password: string;
  timezone: string;
  company?: string;
  phone?: string;
  language?: string;
  tags?: TagsObj[];
  active?: boolean;
}

interface UserInfo extends Omit<UserCreateInfo, "password"> {
  id: GenericID;
  profile: GenericID;
  active: boolean;
  newsletter: boolean;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
  options: object;
  tags: TagsObj[];
}

interface LoginResponse {
  token: GenericToken;
  expire_date: ExpireTimeOption;
}

interface LoginAsUserOptions {
  /**
   * Date to expire the login token.
   *
   * @example
   * "3 months", "1 year", "20 hours"
   * @default "8 hours"
   */
  expire_time?: string;
}

interface SAMLAttributeMappings {
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  company?: string;
  language?: string;
  timezone?: string;
  tags?: {
    [tag: string]: string;
  };
}

interface RunSAMLInfo {
  /**
   * Information for TagoIO's API routes to use as a Service Provider in SAML authentication flows.
   */
  sp: {
    entity_id: string;
    acs_url: string;
    metadata: string;
  };
  /**
   * Relevant information from the Identity Provider's metadata after being parsed by TagoIO.
   */
  idp: {
    issuer: string;
  };
  /**
   * Attribute mappings for the Identity Provider's attributes to the attributes used in TagoIO.
   */
  mapping: SAMLAttributeMappings;
}

interface RunSAMLEditInfo {
  /**
   * Identity Provider's XML metadata encoded in a base 64 string.
   */
  idp_metadata?: string;
  /**
   * Attribute mappings for the Identity Provider's attributes to the attributes used in TagoIO.
   */
  mapping?: SAMLAttributeMappings;
}

type ThemeOption =
  | "actionSchedule"
  | "actionTriggerByData"
  | "actionTriggerByResource"
  | "actionTriggerByMQTT"
  | "alertDangerBackground"
  | "alertInfoBackground"
  | "alertWarningBackground"
  | "analysisExternal"
  | "analysisInternal"
  | "buttonDanger"
  | "buttonDangerText"
  | "buttonDefault"
  | "buttonDefaultText"
  | "buttonDisabled"
  | "buttonDisabledText"
  | "buttonIconLabel"
  | "buttonPrimary"
  | "buttonPrimaryText"
  | "buttonSuccess"
  | "buttonSuccessText"
  | "buttonWarning"
  | "buttonWarningText"
  | "deviceInputOutput1Day"
  | "deviceInputOutput3Days"
  | "deviceInputOutput3Hours"
  | "deviceInputOutput6Hours"
  | "deviceInputOutputRest"
  | "dottedBorder"
  | "dropdownAccent"
  | "dropdownBackground"
  | "floatingSidebarTitle"
  | "footerBackground"
  | "formControlBorder"
  | "gaugeEmpty"
  | "gaugeFill"
  | "gaugePrimaryText"
  | "gaugeSecondaryText"
  | "iconRadioSelected"
  | "iconRadioSubTitle"
  | "informationIcon"
  | "inputBackground"
  | "inputBackgroundReadOnly"
  | "inputError"
  | "inputForeground"
  | "inputForegroundReadOnly"
  | "lightBorder"
  | "limitAlert"
  | "link"
  | "listNavColor"
  | "listTitleLabel"
  | "loading"
  | "loginButton"
  | "loginButtonText"
  | "loginForeground"
  | "loginForm"
  | "modalContainer"
  | "modalOverlay"
  | "navbar"
  | "navbarBetaDeveloperBorder"
  | "navbarButton"
  | "navbarDropdownBorder"
  | "navbarDropdownOption"
  | "navbarDropdownOptionBorder"
  | "navbarText"
  | "navDescription"
  | "notificationButtonAmount"
  | "notificationButtonAmountText"
  | "notificationFilterBackground"
  | "notificationFooter"
  | "notificationItemBorder"
  | "notificationItemDate"
  | "notificationItemTextAccepted"
  | "notificationItemUnread"
  | "primary"
  | "publicPageNavigationBar"
  | "sidebarAccessSelected"
  | "sidebarAccountSelected"
  | "sidebarActionSelected"
  | "sidebarAnalysisSelected"
  | "sidebarBackground"
  | "sidebarBillingSelected"
  | "sidebarBucketSelected"
  | "sidebarDashboardSelected"
  | "sidebarDeviceSelected"
  | "sidebarExploreSelected"
  | "sidebarFileSelected"
  | "sidebarForegroundIcon"
  | "sidebarForegroundText"
  | "sidebarHomeSelected"
  | "sidebarItem"
  | "sidebarRibbon"
  | "sidebarRunSelected"
  | "sidebarSeparator"
  | "sidebarSeparatorForeground"
  | "sidebarUserSelected"
  | "snakeButtonOutline"
  | "svgTagoFont"
  | "svgTagoIOHole"
  | "switchDisabledBackground"
  | "switchSlider"
  | "tabBackground"
  | "tabLabelBorder"
  | "tooltipContainer"
  | "tooltipText"
  | "verticalTabItem"
  | "verticalTabItemBorder"
  | "widgetCardBackground"
  | "widgetIconsAccent"
  | "widgetIconsBackground"
  | "widgetIconsColor"
  | "widgetIconsFooterBasic"
  | "widgetIconsFooterPremium"
  | "auth_bg_opacity"
  | "auth_bg_src"
  | "auth_bg_type"
  | "auth_form_opacity";

type UserQuery = Query<UserInfo, "name" | "active" | "last_login" | "created_at" | "updated_at">;

export {
  RunInfo,
  UserCreateInfo,
  UserInfo,
  LoginResponse,
  UserQuery,
  LoginAsUserOptions,
  RunSAMLInfo,
  RunSAMLEditInfo,
};
