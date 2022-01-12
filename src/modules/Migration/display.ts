// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old DISPLAY to new DISPLAY
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";
import convertFormula from "./common/convertFormula";

export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  const newStructure: any = {
    dashboard: oldWidget.dashboard,
    display: {
      font_size: {
        type: "auto",
      },
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      show_units: true,
      show_variables: !oldDisplay.hide_variables,
      style: "default",
      variables: [],
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "display",
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
        const key = `${item.origin}${variable}`;

        const alias = oldDisplay.vars_labels?.[key];
        const numberFormat = oldDisplay.vars_format?.[key];
        const formula = convertFormula(oldDisplay.vars_formula?.[key]);

        newStructure.display.variables.push({
          origin: item.origin,
          variable,
          ...(alias ? { alias } : {}),
          ...(numberFormat ? { number_format: numberFormat } : {}),
          ...(formula ? { formula } : {}),
        });
      }
    }
  }

  return newStructure;
}

export function isOldStructure(widget: any) {
  const isOld = !!(
    widget?.display?.vars_labels ||
    widget?.display?.vars_format ||
    widget?.display?.vars_formula ||
    widget?.display?.numberformat ||
    widget?.display?.column_alignments ||
    widget?.display?.hide_variables !== undefined ||
    widget?.display?.watermark !== undefined
  );

  return isOld;
}
