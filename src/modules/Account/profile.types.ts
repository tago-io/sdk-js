import { GenericID } from "../../common/common.types";
import { BillingService } from "./billing.types";

interface ProfileListInfo {
  id: GenericID;
  name: string;
  logo_url: string | null;
}

interface ProfileLimit {
  input: number;
  output: number;
  sms: number;
  email: number;
  analysis: number;
  data_records: number;
  run_users: number;
  push_notification: number;
  file_storage: number;
}

interface ProfileInfo {
  info: {
    id: GenericID;
    account: GenericID;
    name: string;
    logo_url: string | null;
    created_at: Date;
    updated_at: Date;
  };
  limits: ProfileLimit;
  auto_scale: object;
  account_plan: string;
}

interface ProfileSummary {
  limit: ProfileLimit;
  amount: {
    device: number;
    bucket: number;
    dashboard: number;
    dashboard_shared: number;
    analysis: number;
    action: number;
    am: number;
    run_users: number;
    dictionary: number;
    connectors: number;
    networks: number;
    tcore: number;
  };
  limit_used: {
    input: number;
    output: number;
    analysis: number;
    sms: number;
    email: number;
    data_records: number;
    run_users: number;
    push_notification: number;
    file_storage: number;
    tcore: number;
  };
  addons: {
    custom_dns: boolean;
    mobile: boolean;
  };
}

/**
 * Type for a single usage statistic with timestamp.
 *
 * Not all of the services will be present for every statistic, only if for the usage period the service was used.
 */
type UsageStatistic = Partial<Record<BillingService, number>> & {
  /**
   * Timestamp for the usage statistic.
   */
  time: Date;
};

interface AuditLog {
  events?: {
    resourceName: string;
    message: string;
    resourceID: GenericID;
    who: GenericID;
    date: Date;
  }[];
  statistics?: {
    recordsMatched: number;
    recordsScanned: number;
    bytesScanned: number;
  };
  status?: "Running" | "Complete" | "Failed" | "Timeout" | "Unknown";
  queryId: string;
}

type resourceNameType =
  | "action"
  | "am"
  | "analysis"
  | "connector"
  | "dashboard"
  | "device"
  | "dictionary"
  | "network"
  | "profile"
  | "run"
  | "runuser";
interface AuditLogFilter {
  resourceID?: GenericID;
  resourceName?: resourceNameType;
  find?: "*" | string;
  start_date?: Date;
  end_date?: Date;
  limit?: number;
}

interface AddonInfo {
  id: GenericID;
  name: string;
  logo_url: string | null;
}

export { ProfileListInfo, ProfileInfo, UsageStatistic, AuditLog, AuditLogFilter, AddonInfo, ProfileSummary };
