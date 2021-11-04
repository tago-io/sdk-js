// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old MAP to new MAP
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";
import { convertFormula, convertInterval } from "./common/";

function isValidMode(mode: string): boolean {
  return mode === "basic" || mode === "dark" || mode === "light" || mode === "sattelite";
}

function convertFilterBy(filterBy: string): string {
  switch (filterBy) {
    case "values":
      return "value";
    case "devices":
      return "device";
    // When filterBy is null, the default is "variable" for legacy
    default:
      return "variable";
  }
}

function convertFilterVariables(filterVariable: any): any {
  if (!Array.isArray(filterVariable)) {
    return [];
  }

  // Remove duplicate strings
  return [...Array.from(new Set(filterVariable?.map((e) => e?.variable) || []))];
}

function convertGeofence(oldDisplay: any): any {
  if (!oldDisplay?.geo_variable) {
    return null;
  }
  return {
    enable_user: oldDisplay?.geo_enable_user,
    events: oldDisplay?.geo_events || [],
    events_label: oldDisplay?.geo_events_label,
    limit: oldDisplay?.geo_limit,
    type_enable_user: oldDisplay?.geo_type_enable_user || "circle",
    variable: {
      bucket: oldDisplay?.geo_variable?.origin?.bucket,
      origin: oldDisplay?.geo_variable?.origin?.id,
      variable: oldDisplay?.geo_variable?.variable,
    },
  };
}

/**
 * Some icons use the old form
 */
function parserIcon(cssClass: string): string {
  switch (cssClass) {
    case "flaticon flaticon-car95":
      return "car";
    case "flaticon flaticon-pin56":
      return "location";
    case "flaticon flaticon-home152":
      return "residence";
    case "flaticon flaticon-vehicle12":
      return "bus";
    case "flaticon flaticon-scooter8":
      return "motorcycle";
    case "flaticon flaticon-delivery51":
      return "truck";
    case "flaticon flaticon-mail10":
      return "mail";
    case "flaticon flaticon-home153":
      return "residence";
    default:
      return cssClass;
  }
}

function convertGroupBy(oldGroupBy: string): string {
  if (oldGroupBy === "date") {
    return "time";
  }
  return oldGroupBy ?? "time";
}

export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};
  const geofence = convertGeofence(oldDisplay);
  const filterBy = convertFilterBy(oldDisplay?.filter_by);
  const canListByDevice = !!oldDisplay.filter_devices?.find((e: any) => e?.name) || false;
  const newStructure: any = {
    dashboard: oldWidget.dashboard,
    display: {
      center_options: {
        center_all_variables: true,
        show_only_last_values: false,
        variables: [],
      },
      custom_text: {
        ...(oldDisplay?.filter_title ? { SEARCH_FOR_FILTER: oldDisplay?.filter_title } : {}),
      },
      direction_variable: oldDisplay?.show_directions
        ? {
            show_current_direction: !!oldDisplay?.show_current_direction,
            variable: {
              origin: oldDisplay?.direction_variable?.origin?.id,
              variable: oldDisplay?.direction_variable?.variable,
            },
          }
        : {},
      filter_by: filterBy,
      filter_list_by: canListByDevice && filterBy === "device" ? "device" : "variable", // The old widget does not have this feature
      filter_variables: convertFilterVariables(oldDisplay?.filter_variable),
      group_by: convertGroupBy(oldDisplay?.group_by),
      group_markers: oldDisplay?.group_markers ?? true,
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      infobox_config: {
        date_format: "",
        image: {
          behavior: "landscape",
          object_fit: "contain",
          position: "top",
        },
        show_window_closed: oldDisplay?.infowindow_closed ? oldDisplay?.infowindow_closed : true,
      },
      initial_mode: isValidMode(oldDisplay?.mode) ? oldDisplay?.mode : "basic",
      intervals: oldDisplay?.intervals?.map(convertInterval) || [],
      max_points: oldWidget?.data?.[0]?.query === "last_location" ? 1 : oldDisplay?.max_points,
      show_directions: !!oldDisplay?.show_directions,
      show_filter: !!oldDisplay?.show_filter,
      show_icons_for_all: oldDisplay?.icons_for_all,
      show_lines: !!oldDisplay?.connect_markers,
      show_lines_animated: !!oldDisplay?.ant_path,
      variables: [],
      ...(geofence ? { geofence } : {}),
      ...(oldDisplay?.initial_zoom !== 0 ? { initial_zoom: oldDisplay?.initial_zoom } : {}),
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "map",
  };

  if (Array.isArray(oldWidget.data)) {
    newStructure.data = oldWidget.data; // transfers the .data property

    newStructure.display.variables = []; // creates the variable array

    if (oldWidget?.query === "last_location") {
      newStructure.display.max_points = 1;
    }

    for (const item of oldWidget.data) {
      if (item.is_hide || item?.is_global_time_data) {
        // is_hide items are not visible in the columns, so we cannot
        // put them in the variables array
        continue;
      }

      for (const variable of item.variables) {
        const key = `${item.origin}${variable}`;
        /**
         * Getting the icon svg
         */
        const icon = oldDisplay?.map_icons?.[item.origin]?.css_class || null;
        const color = oldDisplay?.map_icons?.[item.origin]?.color || null;

        const alias = oldDisplay.vars_labels?.[key];
        const numberFormat = oldDisplay.vars_format?.[key];
        const formula = convertFormula(oldDisplay.vars_formula?.[key]);

        const hasConditions = oldDisplay?.vars_conditions?.[`${item?.origin}`]?.variable === variable;
        const iconType = hasConditions ? "conditional" : "fixed";

        const iconConditions = hasConditions ? oldDisplay?.vars_conditions?.[`${item?.origin}`]?.conditions : null;

        /**
         * If the pin was not set, the default value is the
         * map-marker.
         */
        if (iconConditions && !iconConditions?.url) {
          iconConditions.url = "https://svg.internal.tago.io/map-marker.svg";
        }

        const aliasType = oldDisplay?.vars_that_have_conditions?.[key] ? "icon" : "text";
        const iconLabelConditions = oldDisplay?.conditions?.[key] || [];

        const image = { static_image: oldDisplay?.vars_images?.[key] } || null;

        const url = oldDisplay?.vars_url?.[key]?.url || null;
        const label = oldDisplay?.vars_url?.[key]?.alias || null;
        const link =
          url || label
            ? {
                ...(url ? { url } : {}),
                ...(label ? { label } : {}),
              }
            : null;

        const filterDevices = oldDisplay?.filter_devices || [];
        const findFilterDevice = filterDevices.find((e: any) => e?.id === item?.origin);

        newStructure.display.variables.push({
          alias_type: aliasType,
          icon_conditions: iconLabelConditions,
          infobox: {
            ...(image || link
              ? {
                  ...(image ? { image } : {}),
                  ...(link ? { link } : {}),
                }
              : {}),
          },
          origin: item?.origin,
          pin_config: {
            color,
            icon: parserIcon(icon),
            ...(iconType ? { icon_type: iconType } : {}),
            ...(iconConditions ? { icon_conditions: iconConditions } : {}),
          },
          variable,
          ...(alias ? { alias } : {}),
          ...(numberFormat ? { number_format: numberFormat } : {}),
          ...(formula ? { formula } : {}),
          ...(findFilterDevice ? { originName: findFilterDevice?.name } : {}),
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
    widget?.display?.map_icons ||
    widget?.display?.ignore_00 ||
    widget?.display?.connect_markers ||
    widget?.display?.watermark !== undefined
  );

  return isOld;
}
