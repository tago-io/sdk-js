// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old DYNAMIC_TABLE to new DYNAMIC_TABLE
// ? ====================================================================================

import { WidgetInfo } from "../Account/dashboards.types";
import { convertFormula, convertInterval } from "./common";

export const dynamicTableConfig = {
  cellFilterHeight: 56, // height of cell with a filter in it
  cellHeight: 28, // height of default cell
  defaultControlColumn: {
    alias: "Controls",
    alignment: "center",
    delete_cancel_text: "Cancel",
    delete_confirm_text: "Yes, delete row",
    delete_message: "Do you really want to delete this row?",
    delete_title: "Delete row",
    fixed_width: 33,
    id: "control",
    is_control: true,
    overflow_behavior: "stretch",
    show_delete: true,
    show_edit: true,
    size: "fixed",
  },
  defaultDateColumn: {
    alias: "Date and Time",
    allow_resize: true,
    fixed_width: 100,
    id: "date",
    is_date: true,
    overflow_behavior: "stretch",
    size: "auto",
  },
};

export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  const newStructure: any = {
    analysis_run: oldWidget.analysis_run,
    dashboard: oldWidget.dashboard,
    display: {
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      max_rows: oldDisplay.max_rows || 10000,
      search_position: "whole",
      show_control: false,
      show_search: oldDisplay.show_search,
      show_time: oldDisplay.show_time,
      theme: {
        color: {},
      },
      variables: [],
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: oldWidget.realtime,
    type: "dynamic_table",
  };

  let showEdit = false;
  let sequentialID = 0;
  let createControlColumn = false;

  if (oldDisplay.show_delete) {
    createControlColumn = true;
  }

  if (Array.isArray(oldDisplay.intervals)) {
    // transfer the intervals
    newStructure.display.intervals = oldDisplay.intervals.map(convertInterval);
  }

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
        const keyReverse = `${variable}${item.origin}`; // form fields use key in reverse

        const alias = oldDisplay.vars_labels?.[key];
        const numberFormat = oldDisplay.vars_format?.[key];
        const formula = convertFormula(oldDisplay.vars_formula?.[key]);
        const alignment = oldDisplay.column_alignments?.[key] || "left";
        const iconConditions = oldDisplay.conditions?.[key];
        const overrideColor = oldDisplay?.override_color;
        const usesIcon = oldDisplay?.vars_that_have_conditions?.[key];
        const allowResize = true;
        const id = `data:id:${++sequentialID}`;
        const data = {
          origin: item.origin,
          variable,
        };

        const formField = oldDisplay.form?.fields?.[keyReverse];
        const edit = createEditObject(formField);

        if (edit?.enabled) {
          createControlColumn = true;
          showEdit = true;
        }

        const column: any = {
          alignment,
          allow_resize: allowResize,
          content_type: usesIcon ? "icon" : "value",
          data,
          id,
          override_color: overrideColor || false,
        };

        if (iconConditions) {
          column.icon_conditions = iconConditions;
        }
        if (alias) {
          column.alias = alias;
        }
        if (numberFormat && Object.keys(numberFormat).length > 0) {
          column.number_format = numberFormat;
        }
        if (formula) {
          column.formula = formula;
        }
        if (edit) {
          column.edit = edit;
        }

        newStructure.display.variables.push(column);
      }
    }
  }

  // here we verify if the show_time parameter is true, and if it is
  // we need to create a new column to hold the dates information
  if (newStructure.display.show_time) {
    // create a new column for date/times
    const dateColumn = dynamicTableConfig.defaultDateColumn;
    newStructure.display.variables.push(dateColumn);
  }

  // here we verify if the createControlColumn parameter is true, and if it is
  // we need to create a new column to hold the control information
  if (createControlColumn) {
    // create a new column for control
    const controlColumn = {
      ...dynamicTableConfig.defaultControlColumn,
      show_delete: oldDisplay.show_delete,
      show_edit: showEdit,
      show_edit_modal: oldDisplay.show_edit_modal,
    };

    if (oldDisplay.messageDeleteRow) {
      // if the message was informed, use the one that the use informed
      controlColumn.delete_message = oldDisplay.messageDeleteRow;
    }

    newStructure.display.variables.push(controlColumn);
    newStructure.display.show_control = true;
  }

  return newStructure;
}

function createEditObject(formField: any) {
  if (!formField) {
    return null;
  }

  const edit: any = {
    enabled: formField.editable || false,
    required: formField.required || false,
    show_label: formField.show_label || false, // only for dropdowns
    type: formField.fieldtype || "text",
  };

  if (formField.options) {
    edit.options = formField.options;
  }
  if (formField.use_values_from === "variable") {
    edit.use_values_from = "variable";
  }

  if (formField.use_variable) {
    edit.use_values_from_variable = {
      origin: formField.use_variable?.origin?.id || formField.use_variable?.origin,
      variable: formField.use_variable?.variable,
    };

    if (typeof edit.use_values_from_variable.origin !== "string") {
      // origin has to be a string. If it's not, then something went wrong
      // during the formula conversion.
      edit.use_values_from_variable = null;
    }
  }

  return edit;
}

export function isOldStructure(widget: any) {
  const isOld = !!(
    widget?.display?.vars_labels ||
    widget?.display?.vars_format ||
    widget?.display?.vars_formula ||
    widget?.display?.conditions ||
    widget?.display?.form
  );
  return isOld;
}
