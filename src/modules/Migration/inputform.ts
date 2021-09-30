// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old INPUT FORM to new INPUT FORM
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";
import { generateWidgetItemId } from "./common";
import { convertField, convertSubmitButton } from "./convertFields";

export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  const newStructure: any = {
    dashboard: oldWidget.dashboard,
    display: {
      buttons: [convertSubmitButton(oldDisplay, oldWidget?.analysis_run)],
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      sections: [],
      theme: {
        color: {
          background: null,
          field: null,
          header: null,
        },
      },
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "form",
  };

  const section: any = {
    description: "",
    fields: [],
    id: generateWidgetItemId(),
    show_border: false,
    show_caption: false,
    title: "",
  };

  const fieldsKeys = Object.keys(oldDisplay?.form?.fields || []);

  for (const key of fieldsKeys) {
    const oldField = oldDisplay?.form?.fields[key];
    const visibilityConditions =
      oldField?.visibility_conditions && Array.isArray(oldField?.visibility_conditions)
        ? oldField?.visibility_conditions.map((e: any) => ({
            condition: e?.condition,
            field: `${e?.variable}${e?.origin}`,
            value: e?.value,
          }))
        : [];

    /**
     * Old input form only use one field per variable,
     * so there is no problem to use his key as an id
     * when some fields use the id to reference it, it
     * will be easier to apply
     */
    const field = {
      ...oldField,
      id: key,
      visibility_conditions: visibilityConditions,
    };

    const convertedField = convertField(field, oldDisplay?.form?.show_map);

    if (convertedField) {
      section.fields.push(convertedField);
    }
  }

  newStructure.display.sections.push(section);

  if (Array.isArray(oldWidget.data)) {
    newStructure.data = oldWidget.data;
  }

  return newStructure;
}

export function isOldStructure(widget: any) {
  const isOld = !!(
    !widget?.display?.buttons ||
    widget?.display?.form ||
    widget?.display?.input_type ||
    widget?.display?.bypass_bucket ||
    widget?.display?.label_submit
  );

  return isOld;
}
