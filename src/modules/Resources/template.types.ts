import type { GenericID } from "../../common/common.types";

interface TemplateObjDashboard {
  dashboard: GenericID;
  name: string;
  image_logo?: string;
  image_main?: string;
  /** Dashboard Setup Object */
  setup?: any;
}

interface TemplateObjAnalysis {
  analysis: GenericID;
  name: string;
  image_logo?: string;
  image_main?: string;
  /** Analysis Setup Object */
  setup?: any;
}

interface TemplateInstallDashboard {
  device?: { id: GenericID; bucket: GenericID } | undefined;
  devices?: { id: GenericID; bucket: GenericID } | undefined;
  analysis?: GenericID[] | undefined;
  replace?: { [field: string]: any } | undefined;
}

interface TemplateInstallAnalysis {
  device_token?: string;
  replace?: { [field: string]: any } | undefined;
}

interface TemplateObj {
  name: string;
  type: "dashboard" | "analysis";
  image_main?: string;
  image_logo?: string;
  updated_at: Date;
  created_at: Date;
}

interface TemplateInstallReturn {
  dashboard?: string;
  analysis?: string;
}

export type {
  TemplateObjDashboard,
  TemplateObjAnalysis,
  TemplateInstallDashboard,
  TemplateInstallAnalysis,
  TemplateObj,
  TemplateInstallReturn,
};
