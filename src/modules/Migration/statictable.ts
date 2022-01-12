// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old STATIC TABLE to new STATIC TABLE
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";
import { convertFormula, generateWidgetItemId } from "./common";

export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  const newStructure: any = {
    dashboard: oldWidget.dashboard,
    display: {
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      theme: {
        color: {},
      },
      variables: [],
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "static_table",
  };

  const cells = oldDisplay?.cell || {};
  const cellKeys = Object.keys(cells);

  for (const key of cellKeys) {
    const position = {
      x: Number(key.split("_")?.[1]) || 0,
      y: Number(key.split("_")?.[0]) || 0,
    };

    const size = "auto";
    const dataType = cells[key]?.type === "constant" ? "text" : "variable";

    if (dataType === "text") {
      newStructure.display.variables.push({
        allow_resize: true,
        data_type: dataType,
        id: generateWidgetItemId(),
        position,
        text_content: cells[key]?.constant,
        show_bold: true,
        size,
      });
    } else {
      const variableObject = cells[key]?.variables || {};

      const origin = variableObject?.device?.id || "";
      const variable = variableObject?.variable || "";

      const data = { origin, variable, query: "last_value" };
      const variableKey = `${origin}${variable}`;

      const alias = oldDisplay.vars_labels?.[variableKey];
      const numberFormat = oldDisplay.vars_format?.[variableKey];
      const formula = convertFormula(oldDisplay.vars_formula?.[variableKey]);

      const alignment = oldDisplay?.column_alignments?.[variableKey];
      const contentType = oldDisplay?.conditions?.[variableKey] ? "icon" : "value";
      const iconConditions = oldDisplay?.conditions?.[variableKey];

      newStructure.display.variables.push({
        ...(alias ? { alias } : {}),
        ...(alignment ? { alignment } : {}),
        ...(contentType ? { content_type: contentType } : {}),
        ...(formula ? { formula } : {}),
        ...(iconConditions ? { icon_conditions: iconConditions } : {}),
        ...(numberFormat ? { number_format: numberFormat } : {}),
        allow_resize: true,
        data,
        data_type: dataType,
        id: generateWidgetItemId(),
        position,
        size,
      });

      /**
       * Formulas by variable are not working because the data structure is not
       * encapsuling the new variables.
       */
      if (formula?.enable && formula?.formula_type === "variable" && formula?.variable) {
        const formulaVariable = formula?.variable;
        oldWidget.data.push({
          bucket: formulaVariable?.bucket,
          origin: formulaVariable?.origin,
          variables: [formulaVariable?.variable],
          query: "last_value",
        });
      }
    }
  }

  newStructure.data = oldWidget.data; // transfers the .data property

  return newStructure;
}

export function isOldStructure(widget: any) {
  const isOld = !!(widget?.display?.cell || widget?.display?.vars_that_have_conditions);

  return isOld;
}
