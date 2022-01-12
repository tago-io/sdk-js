// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old PUSH BUTTON to new PUSH BUTTON
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";

function convertState(oldState: any) {
  const newState = {
    ...oldState,
    type: oldState?.type || "text",
    color: oldState?.text_color || "",
  };
  delete newState.text_color;

  return newState;
}

export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  const newStructure: any = {
    analysis_run: oldWidget?.analysis_run,
    dashboard: oldWidget.dashboard,
    display: {
      alias: "",
      button_type: oldDisplay?.button_type === "bi-stable" ? "bistable" : "monostable",
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      show_variables: !oldDisplay?.hide_variables,
      state_one: convertState(oldDisplay?.state_one),
      state_two: convertState(oldDisplay?.state_two),
      theme: {
        color: {
          background: null,
          text: null,
        },
      },
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "push_button",
  };

  if (Array.isArray(oldWidget.data)) {
    for (const item of oldWidget.data) {
      if (item?.is_hide) {
        continue;
      }
      for (const variable of item.variables) {
        const key = `${item?.origin}${variable}`;
        if (oldDisplay?.vars_labels?.[key] && oldDisplay?.vars_labels?.[key] !== variable) {
          newStructure.display.alias = oldDisplay?.vars_labels?.[key];
        }
      }
    }

    newStructure.data = oldWidget.data;
  }
  return newStructure;
}

export function isOldStructure(widget: any) {
  const isOld = !!(widget?.display?.vars_labels || widget?.display?.vars_format || widget?.display?.vars_formula);

  return isOld;
}
