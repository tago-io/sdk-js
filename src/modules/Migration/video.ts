// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old VIDEO to new VIDEO
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";

function convertSource(oldDisplay: any) {
  return {
    static_video: oldDisplay?.static_media || oldDisplay?.static_image,
    type: "static",
  };
}

export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  const newStructure: any = {
    dashboard: oldWidget.dashboard,
    display: {
      auto_play: true,
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      initially_muted: true,
      loop: true,
      object_fit: "contain",
      occupy_whole_widget: false,
      show_controls: true,
      source: convertSource(oldDisplay),
      theme: {
        color: {
          background: null,
          header: null,
        },
      },
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "video",
  };

  if (Array.isArray(oldWidget.data)) {
    newStructure.data = oldWidget.data;
  }

  return newStructure;
}

export function isOldStructure(widget: any) {
  const isOld = !!(
    widget?.display?.type_media ||
    widget?.display?.type_image ||
    widget?.display?.static_media ||
    widget?.display?.static_image ||
    widget?.display?.conditions
  );

  return isOld;
}
