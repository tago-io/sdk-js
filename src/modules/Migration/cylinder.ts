// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old CYLINDER to new CYLINDER
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";
import { convertFormula, convertRange } from "./common";

export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  let decimalsString = "";
  if (oldDisplay?.numberformat && typeof oldDisplay?.numberformat === "string") {
    decimalsString = oldDisplay?.numberformat?.split(".")?.[1] || "";
  }
  const decimals = decimalsString.length || -1;

  const conditions =
    Array.isArray(oldDisplay?.conditions) && oldDisplay?.conditions.length > 0 ? oldDisplay?.conditions : [];
  conditions.reverse();

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
          fill: conditions,
          glass: null,
          header: null,
          text: null,
          tick: null,
        },
      },
      tick_amount: oldDisplay?.num_ticks || 5,
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "cylinder",
  };
  // Tick amount should be number in all circumstance
  newStructure.display.tick_amount = Number(newStructure.display.tick_amount);

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

export function isOldStructure(widget: any) {
  const isOld = !!(widget?.display?.vars_labels || widget?.display?.vars_format || widget?.display?.vars_formula);

  return isOld;
}
