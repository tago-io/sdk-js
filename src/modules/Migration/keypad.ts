// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old KEYPAD to new KEYPAD
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";

export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  const newStructure: any = {
    dashboard: oldWidget.dashboard,
    display: {
      buttons: oldDisplay?.buttons || [],
      bypass_bucket: oldDisplay?.bypass_bucket,
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      message_variable: oldDisplay?.message_variable,
      play_audio: !!oldDisplay?.play_audio,
      send_run_user: !!oldDisplay?.send_run_user,
      show_asterisk: !!oldDisplay?.show_asterisk,
      show_digits_bar: !!oldDisplay?.show_digits_bar,
      show_last_column: !!oldDisplay?.show_last_column,
      show_last_row: !!oldDisplay?.show_last_row,
      show_number_sign: !!oldDisplay?.show_number_sign,
      theme: {
        color: {
          background: oldDisplay?.main_color,
          click: oldDisplay?.click_color,
          header: null,
        },
      },
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "keypad",
  };

  if (Array.isArray(oldWidget.data)) {
    newStructure.data = oldWidget.data;
  }
  return newStructure;
}

export function isOldStructure(widget: any) {
  const isOld = !!(widget?.display?.watermark !== undefined || widget?.display?.click_color);

  return isOld;
}
