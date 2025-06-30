import type { Conditionals, ExpireTimeOption, GenericID, Query, TagsObj } from "../../common/common.types";

type ActionType =
  | "condition"
  | "resource"
  | "interval"
  | "schedule"
  | "mqtt_topic"
  | "usage_alert"
  | "condition_geofence";
type TriggerGeofenceValueType = {
  /** E.g [longitude, latitude] */
  center?: number[];
  radius?: number;
  /** E.g [[longitude, latitude], [longitude, latitude], ...] */
  coordinates?: number[][];
};

type ContentVariables = {
  name: string;
  value: string;
};

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
      headers: Record<string, any>;
      type: "post";
      url: string;
    }
  | {
      type: "sms-twilio";
      message: string;
      to: string;
      from: string;
      twilio_sid: GenericID;
      twilio_token: GenericID;
    }
  | {
      type: "whatsapp-twilio";
      message: string;
      to: string;
      from: string;
      twilio_sid: GenericID;
      twilio_token: GenericID;
      content_variables: ContentVariables[];
      content_sid: GenericID;
    }
  | {
      type: "email-sendgrid";
      from: string;
      message: string;
      subject: string;
      to: string;
      sendgrid_api_key: GenericID;
    }
  | {
      type: "email-smtp";
      from: string;
      message: string;
      subject: string;
      to: string;
      smtp_secret: GenericID;
    }
  | {
      type: "queue-sqs";
      sqs_secret: GenericID;
      batch_enabled: boolean;
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
      /** The cron expression */
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
      service_or_resource:
        | "input"
        | "output"
        | "analysis"
        | "data_records"
        | "sms"
        | "email"
        | "run_users"
        | "push_notification"
        | "file_storage"
        | "device"
        | "dashboard"
        | "action"
        | "tcore"
        | "team_members"
        | "am";
      condition: "=" | ">";
      condition_value: number;
    }
  | {
      device: string;
      variable: string;
      is: "IN" | "OUT";
      value: TriggerGeofenceValueType;
      unlock?: boolean;
    };

interface ActionCreateInfo {
  /** The name for the action. */
  name: string;
  /** Profile identification */
  profile?: GenericID;
  /** True if the action is active or not. The default is true. */
  active?: boolean;
  /** An array of tags. */
  tags?: TagsObj[];
  /** Description of the action. */
  description?: string | null;
  lock?: boolean;
  /** Type of action */
  type?: ActionType;
  /** Array of trigger configuration according to type */
  trigger?: ActionTriggerType[];
  /** Action configuration */
  action: ActionTypeParams;
  /** Action action. */
  id?: GenericID;
  /** Trigger the action when unlock condition is met. */
  trigger_when_unlock?: boolean;
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

export type { ActionInfo, ActionCreateInfo, ActionQuery, MQTTResourceAction };
