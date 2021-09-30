// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old SEMIDONUT to new SEMIDONUT
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";
import { chartColors } from "./common";

export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  const newStructure: any = {
    dashboard: oldWidget.dashboard,
    display: {
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      show_legend: true,
      variables: [],
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "semidonut",
  };

  if (Array.isArray(oldWidget.data)) {
    newStructure.data = oldWidget.data; // transfers the .data property

    newStructure.display.variables = []; // creates the variable array

    for (const item of oldWidget.data) {
      if (item.is_hide) {
        // is_hide items are not visible, so we cannot
        // put them in the variables array
        continue;
      }

      for (const variable of item?.variables) {
        const key = `${item.origin}${variable}`;

        const alias = oldDisplay.vars_labels?.[key];
        const numberFormat = oldDisplay.vars_format?.[key];
        const color =
          chartColors.find((e) => {
            return !newStructure.display.variables.find((v: any) => v?.color === e);
          }) || "#999";

        newStructure.display.variables.push({
          color,
          origin: item.origin,
          variable,
          ...(alias ? { alias } : {}),
          ...(numberFormat ? { number_format: numberFormat } : {}),
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
    widget?.display?.numberformat ||
    widget?.display?.hide_variables !== undefined ||
    widget?.display?.watermark !== undefined ||
    widget?.display?.pie_type
  );

  return isOld;
}
