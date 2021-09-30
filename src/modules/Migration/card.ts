// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old CARD to new CARD.
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";
import { removeHttpFromURL } from "./common/";

function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  let decimalsString = "";
  if (oldDisplay?.numberformat && typeof oldDisplay?.numberformat === "string") {
    decimalsString = oldDisplay?.numberformat?.split(".")?.[1] || "";
  }
  const decimals = decimalsString.length || -1;

  const newStructure: any = {
    dashboard: oldWidget.dashboard,
    display: {
      alias: "",
      formula: {
        enable: false,
        fixed_unit: oldDisplay?.unit || "",
        unit_type: "fixed",
      },
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      max_points: oldDisplay?.max_points || 5,
      number_format: {
        decimals,
        show_thousand: false,
      },
      show_chart: !!oldDisplay?.show_chart,
      show_unit: !!oldDisplay?.show_unit,
      show_variables: !oldDisplay?.hide_variables,
      theme: {
        color: {
          background: oldDisplay?.conditions_background || [],
          chart: oldDisplay?.conditions_chart || [],
          text: oldDisplay?.conditions_value || [],
        },
      },
      url: removeHttpFromURL(oldDisplay?.url) || "",
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "card",
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

function isOldStructure(widget: any): boolean {
  const isOld = !!(widget?.display?.vars_labels || widget?.display?.vars_format || widget?.display?.vars_formula);

  return isOld;
}

export { convert, isOldStructure };
