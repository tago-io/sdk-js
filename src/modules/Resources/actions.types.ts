import { Conditionals, ExpireTimeOption, GenericID, Query, TagsObj } from "../../common/common.types";

type ActionType = "condition" | "resource" | "interval" | "schedule" | "mqtt_topic";

type ActionTypeParams =
  | {
      script: string | string[];
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
      qos?: number;
      retain?: boolean;
    }
  | {
      headers: {};
      fallback_token?: string | null | undefined;
      type: "post";
      url: string;
    }
  | {
      type: "insert_bucket";
    }
  | {
      type: "tcore";
      tcore_id: string;
      device_token: string;
    }
  | {
      type: "tcore";
      device_token: string;
      tcore_cluster_id: string;
    };

type ActionTriggerType =
  | {
      resource: "device" | "bucket" | "file" | "analysis" | "action" | "am" | "user" | "financial" | "profile";
      when:
        | "create"
        | "update"
        | "delete"
        | "mqtt_connect"
        | "mqtt_disconnect"
        | "login_success"
        | "login_fail"
        | "chunk_copied";
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
    }
  | {
      variable: string;
      is: Conditionals;
      value: string;
      second_value?: string;
      value_type: "string" | "number" | "boolean" | "*";
      unlock?: boolean;
      tag_key: string;
      tag_value: string;
    }
  | {
      device: string;
      topic: string;
    }
  | {
      tag_key: string;
      tag_value: string;
      topic: string;
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
  description?: string | null | undefined;
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

interface ActionInfo extends ActionCreateInfo {
  id: GenericID;
  last_triggered: ExpireTimeOption;
  updated_at: Date;
  created_at: Date;
}

interface MQTTResourceAction {
  client_id: string;
  connected_at: string;
  disconnect_at?: string;
}

type ActionQuery = Query<ActionInfo, "name" | "active" | "last_triggered" | "created_at" | "updated_at">;

export { ActionInfo, ActionCreateInfo, ActionQuery, MQTTResourceAction };
