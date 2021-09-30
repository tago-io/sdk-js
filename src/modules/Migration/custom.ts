// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old CUSTOM to new CUSTOM
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";

export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  const newStructure: any = {
    analysis_run: oldWidget?.analysis_run,
    dashboard: oldWidget.dashboard,
    data: oldWidget?.data || [],
    display: {
      header_buttons: oldDisplay.header_buttons || [],
      header_size: oldDisplay?.header_size,
      help: oldDisplay.help || "",
      parameters: oldDisplay?.parameters || [],
      theme: {
        color: {
          background: null,
        },
      },
      url: oldDisplay?.url || "",
      user: oldDisplay?.user,
      variables: oldDisplay?.variables || [],
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "iframe",
  };

  return newStructure;
}

export function isOldStructure(widget: any) {
  const isOld = !!(widget?.display?.watermark !== undefined);

  return isOld;
}
