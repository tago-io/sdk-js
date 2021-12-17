// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old ICON to new ICON
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";
import convertFormula from "./common/convertFormula";

const layoutMatrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  const newStructure: any = {
    dashboard: oldWidget.dashboard,
    display: {
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      show_units: !!oldDisplay?.show_unit,
      show_values: !oldDisplay?.hide_values,
      show_variables: !oldDisplay?.hide_variables,
      variables: [],
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "icon",
  };

  const variables = [];

  if (Array.isArray(oldWidget.data)) {
    newStructure.data = oldWidget.data; // transfers the .data property

    for (const item of oldWidget.data) {
      if (item.is_hide) {
        // is_hide items are not visible in the columns, so we cannot
        // put them in the variables array
        continue;
      }

      for (const variable of item.variables) {
        const key = `${item.origin}${variable}`;

        const { show_thousand, decimals } = oldDisplay.vars_format?.[key] || {};
        const numberFormat =
          show_thousand || decimals
            ? {
                decimals,
                show_thousand,
              }
            : null;

        const alias = oldDisplay.vars_labels?.[key];
        const formula = convertFormula(oldDisplay.vars_formula?.[key]);

        const iconConditions = oldDisplay?.conditions?.[key] || [];
        const colorConditions = iconConditions.map((e: any) => ({
          color: e?.color,
          condition: e?.condition,
        }));

        const layout = oldDisplay?.layout?.[key] || null;
        /**
         * If none column or row has been found, it should takes the 0 position
         * If two variables has the same position doesn't matter
         */
        const row = layout?.row || 0;
        const column = layout?.column || 0;
        const position = layout ? layoutMatrix[row][column] : 10;

        variables.push({
          // Not sent to backend, position tracking for sorting the variables
          _position: position,
          origin: item.origin,
          variable,
          ...(alias ? { alias } : {}),
          ...(numberFormat ? { number_format: numberFormat } : {}),
          ...(formula ? { formula } : {}),
          ...(iconConditions ? { icon_conditions: iconConditions } : {}),
          ...(colorConditions ? { color_conditions: colorConditions } : {}),
        });
      }
    }
  }

  /**
   * Sort by the position of the icon
   */
  variables.sort((a, b) => {
    if (a._position > b._position) {
      return 1;
    }
    if (a._position < b._position) {
      return -1;
    }
    return 0;
  });

  /**
   * Remove the _position property
   */
  newStructure.display.variables = variables.map((e) => {
    delete e._position;
    return e;
  });

  return newStructure;
}

export function isOldStructure(widget: any) {
  const isOld =
    !!(
      widget?.display?.vars_labels ||
      widget?.display?.vars_format ||
      widget?.display?.vars_formula ||
      widget?.display?.numberformat ||
      widget?.display?.hide_values ||
      widget?.display?.hide_variables
    ) && !widget?.display?.variables;

  return isOld;
}
