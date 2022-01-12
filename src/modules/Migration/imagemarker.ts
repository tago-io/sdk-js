// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old IMAGE MARKER to new IMAGE MARKER
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";
import { convertFormula } from "./common";

export function convertLayerData(widget: any, oldWidgetData: any) {
  const fields = [];
  const layerVariable = widget?.display?.layer_variable;
  // Map old keys (Origin id + Variable name) to new key (Origin)
  const mapOldToNew: any = {};
  for (const dt of widget.data) {
    if (
      dt?.variables?.[0] &&
      (layerVariable?.origin?.id !== dt?.origin || layerVariable?.variable !== dt?.variables?.[0])
    ) {
      const key = `${dt?.origin}${dt?.variables?.[0]}`;
      mapOldToNew[key] = dt?.origin;
    }
  }

  for (const x of oldWidgetData) {
    if (
      x?.data?.variables?.[0] &&
      x?.data?.origin === layerVariable?.origin?.id &&
      x?.data?.variables?.[0] === layerVariable?.variable
    ) {
      for (const y of x?.result) {
        const oldFixedPos = y?.metadata?.fixed_position || {};
        const keysFixedPos = Object.keys(oldFixedPos);
        const newFixedPos = { ...oldFixedPos };
        for (const k of keysFixedPos) {
          const newK = mapOldToNew?.[k];
          if (newK) {
            newFixedPos[newK] = { ...oldFixedPos[k] };
          }
        }
        fields.push({
          ...y,
          metadata: {
            ...y?.metadata,
            fixed_position: newFixedPos,
          },
        });
      }
    }
  }
  return fields;
}

export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  const newStructure: any = {
    dashboard: oldWidget.dashboard,
    display: {
      // Image marker display properties
      allow_add: oldDisplay?.allow_add || true,
      allow_edit: oldDisplay?.allow_move || true,
      allow_edit_layers: oldDisplay?.allow_edit_layers || true,
      allow_embed_url: !!oldDisplay?.allow_embed_url,
      allow_image_url: !!oldDisplay?.allow_image_url,
      allow_label: !!oldDisplay?.allow_label,
      allow_pin_color: !!oldDisplay?.allow_pin_color,
      allow_remove: oldDisplay?.allow_remove || true,
      allow_zoom: false,
      connect_markers: !!oldDisplay?.connect_markers,
      filter_by: "device",
      filter_truncate_direction: "end",
      geofence: {
        enable_user: false,
        events_type: "static",
        limit: 100,
        type_enable_user: "all",
      },
      infobox_config: {
        behavior: "landscape",
        date_format: "",
        object_fit: "contain",
        position: "top",
        show_one_infobox: true,
      },
      layer: oldDisplay?.layer_variable || {},
      layer_sub_type: oldDisplay?.layer_sub_type === "basic" ? "basic" : "advanced",
      markdown_box: "",
      max_points: oldDisplay?.max_points || 1,
      object_fit: "contain",
      occupy_whole_widget: false,
      show_filter: false,
      show_last_update: false,
      show_polyline: false,
      show_side_value: false,
      theme: {
        color: {
          background: null,
          button_background: null,
          button_icon: null,
          header: null,
          infobox_background: null,
          infobox_header: null,
          infobox_text: null,
          zoom_button_background: null,
          zoom_button_border: null,
          zoom_button_icon: null,
        },
      },
      tools_title: oldDisplay?.title_window || "Tools",

      // Default properties for widgets
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      variables: [],
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "image_marker",
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

        const varConditions = oldDisplay?.vars_conditions?.[key];
        const varUrl = oldDisplay?.vars_url?.[key];
        const varImage = oldDisplay?.vars_images?.[key];
        const varEmbed = oldDisplay?.vars_embed?.[key];

        const externalUrl = varUrl
          ? {
              ...(varUrl?.url ? { external_url: varUrl?.url } : {}),
              ...(varUrl?.alias ? { external_url_label: varUrl?.alias } : {}),
            }
          : null;

        const urlType = oldDisplay?.vars_link_type?.[key];

        newStructure.display.variables.push({
          origin: item.origin,
          override_color: !oldDisplay?.override_color,
          url_type: urlType || "image",
          variable,
          ...(alias ? { alias } : {}),
          ...(numberFormat ? { number_format: numberFormat } : {}),
          ...(formula ? { formula } : {}),
          ...(varConditions ? { color_conditions: varConditions } : {}),
          ...(externalUrl ? { ...externalUrl } : {}),
          ...(varImage ? { img_pin: varImage } : {}),
          ...(varEmbed ? { embed: varEmbed } : {}),
        });
      }
    }
  }

  return newStructure;
}

export function isOldStructure(widget: any) {
  const isOld = !!(
    widget?.display?.vars_labels ||
    widget?.display?.vars_formula ||
    widget?.display?.numberformat ||
    widget?.display?.watermark !== undefined
  );

  return isOld;
}
