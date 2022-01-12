// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old STEP BUTTON to new STEP BUTTON
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";

export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  const newStructure: any = {
    dashboard: oldWidget.dashboard,
    display: {
      alias: "",
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      hour_visualization: oldDisplay?.clock_visualization || "",
      limit: {
        enabled: !!oldDisplay?.enable_limit,
        maximum: oldDisplay?.maximum || 100,
        minimum: oldDisplay?.minimum || 0,
      },
      number_format: {
        decimals: -1,
        show_thousand: false,
      },
      show_unit: !!oldDisplay?.show_unit,
      show_variables: !oldDisplay?.hide_variables,
      step_value: oldDisplay?.increment || 1,
      theme: {
        color: {
          background: null,
          button: oldDisplay?.conditions_button,
          text: null,
          value: oldDisplay?.conditions_text,
        },
      },
      type: oldDisplay?.input_type,
      unit: oldDisplay?.unit || "",
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "step_button",
  };

  if (Array.isArray(oldWidget.data)) {
    for (const item of oldWidget.data) {
      if (item?.is_hide) {
        continue;
      }
      for (const variable of item.variables) {
        const key = `${item?.origin}${variable}`;
        if (oldDisplay?.vars_format?.[key]) {
          newStructure.display.number_format = oldDisplay?.vars_format?.[key];
        }

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
  const isOld = !!(
    widget?.display?.input_type ||
    widget?.display?.vars_labels ||
    widget?.display?.vars_format ||
    widget?.display?.conditions_button
  );

  return isOld;
}
