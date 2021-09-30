// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old IMAGE to new IMAGE
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";

function convertSource(oldDisplay: any) {
  const { type_image } = oldDisplay;
  if (type_image === "static") {
    return {
      static_image: oldDisplay?.static_image || oldDisplay?.static_media,
      type: "static",
    };
  }
  const oldConditions = oldDisplay?.conditions || [];
  return {
    conditions: oldConditions.map((e: any) => ({
      condition: e?.condition,
      url: e?.image || e?.media_url,
      value: e?.value,
    })),
    type: "conditional",
  };
}
/**
 * Takes the OLD widget and returns the NEW structure.
 */
export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  const newStructure: any = {
    dashboard: oldWidget.dashboard,
    display: {
      allow_zoom: false,
      formula: {
        enable: false,
        formula_type: "fixed",
        unit_type: "origin",
        value: "",
      },
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      object_fit: "contain",
      occupy_whole_widget: false,
      show_zoom_buttons: false,
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
    type: "image",
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
