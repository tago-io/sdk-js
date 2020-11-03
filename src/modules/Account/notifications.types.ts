import { GenericID } from "../../common/common.types";

type NotificationType = "dashboard" | "bucket" | "analysis" | "profile" | "tago" | "limit_alert";

type Condition = "None" | "Pending" | "Accepted" | "Refused";

interface NotificationQuery {
  type: NotificationType;
  start_date: Date;
  end_date: Date;
  ref_id: GenericID;
}

interface NotificationInfo {
  id: GenericID;
  ref_id: GenericID | null;
  ref_from: { id: GenericID; name: string };
  type: NotificationType;
  sub_type: string;
  message: string;
  read: boolean;
  condition: Condition;
  created_at: Date;
}

export { NotificationQuery, NotificationInfo, NotificationType };
