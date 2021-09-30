// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old HEAT MAP to new HEAT MAP
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";

export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  const newStructure: any = {
    dashboard: oldWidget.dashboard,
    display: {
      allow_zoom: false,
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      max_points: oldDisplay?.max_points || 500,
      object_fit: "contain",
      occupy_whole_widget: false,
      radius: oldDisplay?.radius || 1,
      scale: {
        enable: !!oldDisplay?.scale_fixed,
        maximum: oldDisplay?.scale_maximum || 100,
        minimum: oldDisplay?.scale_minimum || 0,
        type: "fixed",
      },
      show_coordinates: oldDisplay?.show_coordinates !== undefined ? oldDisplay?.show_coordinates : true,
      show_last_update: false,
      show_scale: oldDisplay?.show_scale !== undefined ? oldDisplay?.show_scale : true,
      show_zoom_buttons: false,
      source: {
        static_image: oldDisplay?.img_path || "",
        type: "static",
      },
      theme: {
        color: {
          background: null,
          button_background: null,
          button_border: null,
          button_icon: null,
          header: null,
          text: null,
          text_background: null,
          text_border: null,
        },
        timezone: {
          id: oldWidget?.data?.[0]?.timezone || "UTC",
        },
      },
      variables: [],
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "heat_map",
  };

  if (Array.isArray(oldWidget.data)) {
    newStructure.data = oldWidget.data; // transfers the .data property

    newStructure.display.variables = []; // creates the variable array

    for (const item of oldWidget.data) {
      if (item.is_hide) {
        // is_hide items are not visible in the columns, so we cannot
        // put them in the variables array
        continue;
      }

      for (const variable of item.variables) {
        newStructure.display.variables.push({
          origin: item.origin,
          overwrite_coordinates: false,
          variable,
        });
      }
    }
  }

  return newStructure;
}

export function isOldStructure(widget: any) {
  const isOld = !!(
    widget?.display?.layer_type ||
    widget?.display?.img_path ||
    widget?.display?.scale_minimum ||
    widget?.display?.scale_maximum ||
    widget?.display?.scale_fixed ||
    widget?.display?.watermark !== undefined
  );

  return isOld;
}
