// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old COMPOSE to new COMPOSE
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";
import { removeHttpFromURL } from "./common/";

export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  const newStructure: any = {
    dashboard: oldWidget.dashboard,
    display: {
      allow_add: false,
      allow_edit: false,
      allow_embed_url: false,
      allow_label: false,
      allow_pin_color: false,
      allow_remove: false,
      allow_zoom: false,
      aspect_ratio: oldDisplay?.aspect_ratio || [],
      background: {},
      background_path: oldDisplay?.background_path || "",
      background_type: oldDisplay?.background_type || "",
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      max_points: 300,
      object_fit: "contain",
      occupy_whole_widget: false,
      pin_size: "big",
      show_last_update: false,
      theme: {
        color: {
          background: null,
          button_background: null,
          button_icon: null,
          header: null,
          infobox_background: null,
          infobox_text: null,
        },
      },
      title_window: "",
      variables: [],
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "compose",
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
        const url = oldDisplay.vars_url?.[key]?.url || null;
        const urlLabel = oldDisplay.vars_url?.[key]?.alias || null;
        const embed = oldDisplay.vars_iframe?.[key] || null;

        const colorConditions = [];
        const icon = oldDisplay.vars_icons?.[key] || null;
        if (icon && icon?.url) {
          colorConditions.push({
            color: icon?.color ? icon.color : "rgb(49, 60, 70)",
            condition: "*",
            url: icon.url,
          });
        }

        newStructure.display.variables.push({
          color_conditions: colorConditions,
          origin: item.origin,
          override_color: false,
          variable,
          ...(alias ? { alias } : {}),
          ...(numberFormat ? { number_format: numberFormat } : {}),
          ...(url ? { external_url: url } : {}),
          ...(urlLabel ? { external_url_label: urlLabel } : {}),
          ...(embed ? { embed: removeHttpFromURL(embed) } : {}),
        });
      }
    }
  }

  return newStructure;
}

export function isOldStructure(widget: any): boolean {
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
