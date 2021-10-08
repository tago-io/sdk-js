// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old ANGULAR to new ANGULAR.
// ? ====================================================================================

import { WidgetInfo } from "../Account/dashboards.types";
import convertFormula from "./common/convertFormula";
import convertRange from "./common/convertRange";

/**
 * Takes the OLD widget and returns the NEW structure.
 */
export function convert(oldWidget: any): WidgetInfo {
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
        fixed_unit: oldDisplay?.unit,
        unit_type: oldDisplay?.unit ? "fixed" : "origin",
      },
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      number_format: {
        decimals,
        show_thousand: false,
      },
      range: convertRange(oldDisplay),
      show_variables: !oldDisplay?.hide_variables,
      theme: {
        color: {
          background: null,
          fill: null,
          outline: null,
          text: null,
          text_border: null,
        },
      },
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "angular",
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
        // This is the formula variable
        if (oldDisplay.vars_formula?.[key]) {
          newStructure.display.formula = convertFormula(oldDisplay.vars_formula?.[key]);
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

/**
 * The note has the OLD structure if the display contains a TEXT property.
 */
export function isOldStructure(widget: any): boolean {
  const isOld = !!(
    widget?.display?.vars_labels ||
    widget?.display?.vars_format ||
    widget?.display?.vars_formula ||
    widget?.display?.gauge_type
  );

  return isOld;
}
