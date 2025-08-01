import type { TagoContext } from "../../Analysis/analysis.types.ts";
import type Device from "../../Device/Device.ts";
import type Account from "../../Resources/AccountDeprecated.ts";
import type { UserCreateInfo } from "../../Resources/run.types.ts";

/**
 * User List scope to be used in your analysis
 * example:
 * - async function editUser({ scope }: RouterConstructor & { scope: UserListScope[] }) {}
 */
interface UserListScope extends Partial<Omit<UserCreateInfo, "password" | "tags">> {
  user: string;
  /** Tag keys are formated as tags.key and parameters as param.key */
  [key: string]: string | any;

  /** old parameter key will include a json with the old values of the parameters */
  old?: { [key: string]: string } & Partial<Omit<UserCreateInfo, "password" | "tags">>;
}

/**
 * Custom Button scope to be used in your analysis functions
 * example:
 * - async function customBtnService({ scope }: RouterConstructor & { scope: CustomBtnScope[] }) {}
 */
interface CustomBtnScope {
  /** only when using User List */
  user?: string;
  /** only when using Device List and Dynamic Table */
  device?: string; //
  /** only when using Dynamic Table */
  group?: string;
  /** only when using Dynamic Table */
  variable?: string;
  /** only when using Dynamic Table */
  value?: string;
  displayValue: string;
  property: string;
}

/**
 * Device List scope to be used in your analysis functions
 * example:
 * - async function editDevice({ scope }: RouterConstructor & { scope: DeviceListScope[] }) {}
 */
interface DeviceListScope {
  device: string;
  name?: string;

  /** Tag keys are formated as tags.key and parameters as param.key */
  [key: string]: string | any;

  /** old parameter key will include a json with the old values of the parameters */
  old?: { name?: string; [key: string]: string };
}

/**
 * Router interface to be used inside your analysis
 */
interface RouterConstructor {
  /** scope of your analysis */
  scope: any[];

  /** environment variable parsed with Utils.envToJson(context.environment) */
  environment: { [key: string]: string };

  /** instanced account class with new Account({ token: "Your-token" }) */
  account?: Account;

  /** instanced device class with new Device({ token: "Your-token" }) */
  config_dev?: Device;

  /** context of your analysis */
  context?: TagoContext;
}

export type { RouterConstructor, UserListScope, DeviceListScope, CustomBtnScope };
