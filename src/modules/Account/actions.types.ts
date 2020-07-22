import { GenericID, Conditionals, TagsObj, Query } from "../../common/common.types";

type ActionType = "condition" | "resource" | "interval" | "schedule" | "mqtt_topic";

type ActionTypeParams =
  | {
      script: GenericID[];
      type: "script";
    }
  | {
      message: string;
      subject: string;
      type: "notification";
    }
  | {
      message: string;
      subject: string;
      run_user: GenericID;
      type: "notification_run";
    }
  | {
      message: string;
      subject: string;
      to: string;
      type: "email";
    }
  | {
      message: string;
      to: string;
      type: "sms";
    }
  | {
      bucket: string;
      payload: string;
      topic: string;
      type: "mqtt";
    }
  | {
      headers: {};
      type: "post";
      url: string;
    };

type ActionTriggerType =
  | {
      resource: "device" | "bucket" | "file" | "analysis" | "action" | "am" | "user" | "financial" | "profile";
      when: "create" | "update" | "delete";
      tag_key: string;
      tag_value: string;
    }
  | {
      interval: string;
    }
  | {
      timezone: string | Date;
      cron: string;
    }
  | {
      device: string;
      variable: string;
      is: Conditionals;
      value: string;
      second_value?: string;
      value_type: "string" | "number" | "boolean" | "*";
      unlock?: boolean;
    };

interface ActionCreateInfo {
  /**
   * The name for the action.
   */
  name: string;
  /**
   * Profile identification
   */
  profile?: GenericID;
  /**
   * True if the action is active or not. The default is true.
   */
  active?: boolean;
  /**
   * An array of tags.
   */
  tags?: TagsObj[];
  /**
   * Description of the action.
   */
  description?: string | null;
  lock?: boolean;
  /**
   * Type of action
   */
  type?: ActionType;
  /**
   * Array of trigger configuration according to type
   */
  trigger?: ActionTriggerType[];
  /**
   * Action configuration
   */
  action?: ActionTypeParams;
  /**
   * Action action.
   */
  id?: GenericID;
}

interface ActionInfo {
  id: GenericID;
  active: boolean;
  blocked: boolean;
  company: string;
  created_at: string;
  email: string;
  language: string;
  last_login: string;
  name: string;
  newsletter: boolean;
  options: {
    user_view_welcome: boolean;
    decimal_separator: string;
    thousand_separator: string;
    last_whats_new: string;
  };
  phone: string;
  send_invoice: boolean;
  stripe_id: string;
  timezone: string;
  type: string;
  updated_at: string;
  plan: string;
}

type ActionQuery = Query<ActionInfo, "name" | "active" | "locked" | "last_triggered" | "created_at" | "updated_at">;

export { ActionInfo, ActionCreateInfo, ActionQuery };
