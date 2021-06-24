import { GenericID, Query } from "../../common/common.types";

interface NotificationTriggerAnalysis {
  analysis_id: GenericID;
}
interface NotificationTriggerHTTP {
  url: string;
  method: "POST" | "GET" | "PUT" | "DELETE" | "REDIRECT";
  body: { [key: string]: any };
}
interface NotificationTriggerProfile {
  share_profile: "accept" | "refuse";
}
interface NotificationButton {
  id: string;
  label: string;
  color?: string;
  triggers: (NotificationTriggerAnalysis | NotificationTriggerHTTP | NotificationTriggerProfile)[];
}
interface NotificationCreate {
  title: string;
  message: string;
  read?: boolean;
  image?: string;
  buttons?: NotificationButton[];
  buttons_enabled?: boolean;
  buttons_autodisable?: boolean;
}
type NotificationQuery = Query<{ read: boolean }, "created_at">;
type NotificationInfo = { id: GenericID; created_at: Date } & Required<NotificationCreate>;

export {
  NotificationCreate,
  NotificationQuery,
  NotificationInfo,
  NotificationButton,
  NotificationTriggerProfile,
  NotificationTriggerHTTP,
  NotificationTriggerAnalysis,
};
