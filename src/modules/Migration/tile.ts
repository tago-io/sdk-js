// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old TILE to new TILE
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";
import { removeHttpFromURL } from "./common";

export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  const newStructure: any = {
    dashboard: oldWidget.dashboard,
    data: [],
    display: {
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      image_type: oldDisplay?.icon_color ? "icon" : "image",
      image_url: oldDisplay?.icon_url || "",
      occupy_whole_widget: oldDisplay?.fit_image,
      opacity: oldDisplay?.opacity,
      theme: {
        color: {
          background: oldDisplay?.background_color || null,
          header: null,
          hover: null,
          icon: oldDisplay?.icon_color || null,
          title: oldDisplay?.label_color || null,
        },
      },
      title: oldDisplay?.label_button || "",
      url: removeHttpFromURL(oldDisplay?.link) || "",
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "tile",
  };

  return newStructure;
}

export function isOldStructure(widget: any) {
  const isOld = !!(
    widget?.display?.background_color ||
    widget?.display?.fit_image ||
    widget?.display?.label_color ||
    widget?.display?.label_button ||
    widget?.display?.link
  );

  return isOld;
}
