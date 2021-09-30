// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Migration of old INPUT CONTROL to new INPUT CONTROL
// ? ====================================================================================
import { WidgetInfo } from "../Account/dashboards.types";
import { generateWidgetItemId } from "./common";

enum EInputControlFieldType {
  "Switch" = "switch",
  "Text" = "text",
}

export function convert(oldWidget: any): WidgetInfo {
  const oldDisplay = oldWidget.display || {};

  const newStructure: any = {
    dashboard: oldWidget.dashboard,
    display: {
      header_buttons: oldDisplay.header_buttons || [],
      help: oldDisplay.help || "",
      sections: [],
      theme: {
        color: {
          background: null,
          field: null,
          footer: null,
        },
      },
    },
    id: oldWidget.id,
    label: oldWidget.label,
    realtime: null,
    type: "control",
  };

  const section: any = {
    description: "",
    fields: [],
    id: generateWidgetItemId(),
    show_border: false,
    show_caption: false,
    title: "",
  };

  for (const oldField of oldDisplay?.controls || []) {
    const data = {
      ...(oldField?.bucket ? { bucket: oldField?.bucket } : {}),
      ...(oldField?.origin ? { origin: oldField?.origin } : {}),
      ...(oldField?.variable ? { variable: oldField?.variable } : {}),
    };

    section.fields.push({
      data,
      icon: null,
      id: generateWidgetItemId(),
      label: oldField?.name,
      label_selected: oldField?.label_yes || "",
      label_type: "text",
      label_unselected: oldField?.label_no || "",
      send_data: true,
      show_new_line: oldField?.new_line !== undefined ? oldField?.new_line : true,
      type: oldField?.type === "switch" ? EInputControlFieldType.Switch : EInputControlFieldType.Text,
    });
  }

  newStructure.display.sections.push(section);
  if (Array.isArray(oldWidget.data)) {
    newStructure.data = oldWidget.data;
  }

  return newStructure;
}

export function isOldStructure(widget: any) {
  const isOld = !!(widget?.display?.watermark !== undefined || widget?.display?.input_type);

  return isOld;
}
