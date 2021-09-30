// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old MULTIPLE AXIS CHART to new MULTIPLE AXIS CHART
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";
import { chartColors, convertDownsample, convertFormula, convertInterval } from "./common";

export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};
  const groupBy = oldDisplay?.group_by === "date" ? "time" : oldDisplay?.group_by;

  const newStructure: any = {
    dashboard: oldWidget.dashboard,
    display: {
      downsample: convertDownsample(oldDisplay),
      group_by: groupBy ? groupBy : "time",
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      intervals:
        oldDisplay?.intervals && Array.isArray(oldDisplay?.intervals) ? oldDisplay.intervals.map(convertInterval) : [],
      line_curve: oldDisplay?.line_curve || "smooth",
      max_points: oldDisplay?.max_points || 5000,
      order_by: oldDisplay?.order_by ? oldDisplay?.order_by : "time",
      show_legend: true,
      show_point_values: !!oldDisplay?.enable_labels,
      stacked: oldDisplay?.stacked === "realtime",
      theme: {
        color: {
          background: null,
          header: null,
          label: null,
          tick: null,
        },
      },
      variables: [],
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "multiple_axis_chart",
  };

  if (oldWidget?.realtime === "variable" && oldDisplay?.plot_by === "time") {
    const timeVariable = oldWidget.data.filter((e: any) => e?.is_global_time_data)?.[0] || {};
    newStructure.display.x_axis = {
      plot_by: "variable",
      type: "time",
      variable: {
        origin: timeVariable?.origin || timeVariable?.origin?.id,
        variable: timeVariable?.variables?.[0] || "",
      },
    };
  } else if (oldDisplay?.plot_by === "group") {
    newStructure.display.x_axis = {
      plot_by: "variable",
      type: "group",
      variable: {
        origin: oldDisplay?.plot_variable_group?.origin?.id || oldDisplay?.plot_variable_group?.origin,
        variable: oldDisplay?.plot_variable_group?.variable,
      },
    };
  } else {
    newStructure.display.x_axis = {
      plot_by: "realtime",
      type: "time",
    };
  }

  if (oldDisplay?.scale === "yes") {
    newStructure.display.y_axis = {
      scale: {
        maximum: oldDisplay?.y_max || "",
        minimum: oldDisplay?.y_min || "",
        type: "fixed",
      },
    };
  } else {
    newStructure.display.y_axis = {
      scale: {
        type: "dynamic",
      },
    };
  }

  newStructure.display.y_axis.show_metric_abbreviation = oldDisplay?.show_abbreviation || "";

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
        const reverseKey = `${variable}${item.origin}`;

        const alias = oldDisplay.vars_labels?.[key];
        const numberFormat = oldDisplay.vars_format?.[key];
        const formula = convertFormula(oldDisplay.vars_formula?.[key]);
        const color =
          chartColors.find((e) => {
            return !newStructure.display.variables.find((v: any) => v?.color === e);
          }) || "#999";

        let chartType = oldDisplay?.variables_chart?.[key] || oldDisplay?.variables_chart?.[reverseKey];

        switch (chartType) {
          case "spline":
            chartType = "line_chart";
            break;
          case "bar":
            chartType = "horizontal_bar_chart";
            break;
          case "column":
            chartType = "vertical_bar_chart";
            break;
          case "area":
            chartType = "area_chart";
            break;
          default:
            break;
        }

        newStructure.display.variables.push({
          color,
          origin: item.origin,
          variable,
          ...(alias ? { alias } : {}),
          ...(numberFormat ? { number_format: numberFormat } : {}),
          ...(formula ? { formula } : {}),
          ...(chartType ? { chart_type: chartType } : {}),
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
