// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old GRAINBIN to new GRAINBIN
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";

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
      alias: oldDisplay?.gauge_label || "",
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
      range: {
        maximum: oldDisplay?.maximum || 100,
        minimum: oldDisplay?.minimum || 0,
        type: "minmax",
      },
      show_variables: !oldDisplay?.hide_variables,
      theme: {
        color: {
          background: null,
          fill: null,
          header: null,
          text: null,
          text_background: null,
        },
      },
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "grainbin",
  };

  if (Array.isArray(oldWidget.data)) {
    newStructure.data = [oldWidget.data?.[0]] || [];
  }
  return newStructure;
}

export function isOldStructure(widget: any) {
  const isOld = !!(
    widget?.display?.gauge_label ||
    widget?.display?.minimum ||
    widget?.display?.maximum ||
    widget?.display?.unit
  );

  return isOld;
}
