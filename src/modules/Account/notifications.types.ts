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

interface NotificationIconImage {
  image_url: string;
  bg_color?: HexColor;
  fit?: "fill" | "contain" | "cover";
}

type HexColor = string;
interface NotificationIconSVG {
  svg_url: string;
  svg_color?: HexColor;
  bg_color?: HexColor;
}
interface NotificationCreate {
  title: string;
  message: string;
  read?: boolean;
  icon?: NotificationIconSVG | NotificationIconImage;
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
  NotificationIconImage,
  NotificationIconSVG,
};
