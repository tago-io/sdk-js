// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old CLOCK to new CLOCK.
// ? ====================================================================================

import { WidgetInfo } from "../Account/dashboards.types";

/**
 * Takes the OLD widget and returns the NEW structure.
 */
export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  const newStructure: any = {
    dashboard: oldWidget.dashboard,
    display: {
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      show_last_update: false,
      theme: {
        color: {
          background: null,
          fill: null,
          header: null,
          outline: null,
          text: null,
          text_border: null,
        },
      },
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "clock",
  };

  newStructure.data = oldWidget.data;

  return newStructure;
}

/**
 * The note has the OLD structure if the display contains a TEXT property.
 */
export function isOldStructure(widget: any): boolean {
  const isOld = !!widget?.display?.gauge_type;

  return isOld;
}
