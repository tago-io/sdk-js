// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old NOTE to new NOTE
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";

export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  const newStructure: any = {
    dashboard: oldWidget.dashboard,
    data: [],
    display: {
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      value: oldDisplay.text || "",
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "note",
  };

  return newStructure;
}

export function isOldStructure(widget: any) {
  const isOld = !!widget?.display?.text;
  return isOld;
}
