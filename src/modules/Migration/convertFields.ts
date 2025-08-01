import { generateWidgetItemId } from "./common";
export enum InputFormField {
  Text = "text",
  Address = "address",
  Barcode = "barcode",
  Calendar = "calendar",
  "Capture user" = "user",
  Checkbox = "checkbox",
  "Clock Set" = "clock-set",
  Device = "device",
  Dropdown = "dropdown",
  "Dropdown Multiple" = "dropdown-multi",
  Email = "email",
  "File Upload" = "upload",
  "Filtered variables" = "filtered",
  Hidden = "hidden",
  "Image / Video Select" = "image-select",
  "Incremental Step" = "incremental-step",
  Number = "number",
  Password = "password",
  "QR Code" = "qrcode",
  Radio = "radio",
  Validation = "validation",
}

function convertDefaultValue(useCurrentValue: string): string {
  let defaultValue: "last" | "fixed" = "last";
  if (typeof useCurrentValue === "string" && useCurrentValue !== "current_value") {
    defaultValue = "fixed";
  }
  return defaultValue;
}

export function convertSubmitButton(oldDisplay: any, runAnalysis: string): Record<string, any> {
  return {
    analysis: runAnalysis || "",
    clear_form: false,
    color: "#337ab7",
    confirmation_cancel: null,
    confirmation_confirm: null,
    confirmation_message: oldDisplay?.form?.message_submit || "",
    confirmation_title: null,
    icon: null,
    id: generateWidgetItemId(),
    identifier: "",
    run_analysis: !!runAnalysis,
    send_data: !oldDisplay?.form?.bypass_bucket,
    show_confirmation: !!oldDisplay?.form?.confirm_before_submit,
    text: !oldDisplay?.form?.label_submit ? "Send" : oldDisplay?.form?.label_submit,
    wait_for_validation: !!oldDisplay?.form?.wait_validation_unlock,
  };
}

export function convertFormField(field: any): any {
  return {
    data: {
      bucket: field?.bucket,
      origin: field?.origin,
      variable: field?.variable,
    },
    id: field?.id || generateWidgetItemId(),
  };
}

export function convertVisualField(field: any): any {
  return {
    ...convertFormField(field),
    icon: null,
    label: field?.label,
    required: !!field?.required,
    show_new_line: field?.new_line !== undefined ? !!field?.new_line : true,
    visibility_conditions: field?.visibility_conditions || [],
    ...(field?.placeholder ? { placeholder: field?.placeholder } : {}),
    ...(field?.unit ? { unit: field?.unit } : {}),
    ...(field?.value_type ? { value_type: field?.value_type } : {}),
  };
}

/**
 * Convert text fields to new widget format
 */
export function convertFieldText(field: any): any {
  return {
    ...convertVisualField(field),
    default_value: convertDefaultValue(field?.use_current_value),
    fixed_value: field?.default,
    type: InputFormField.Text,
  } as any;
}

/**
 * Convert address fields to new widget format
 */
export function convertFieldAddress(field: any, showMap?: any): any {
  return {
    ...convertVisualField(field),
    default_value: convertDefaultValue(field?.use_current_value),
    fixed_value: field?.default,
    show_map: !!showMap,
    type: InputFormField.Address,
  } as any;
}

/**
 * Convert barcode fields to new widget format
 */
export function convertFieldBarCode(field: any): any {
  return {
    ...convertVisualField(field),
    default_value: convertDefaultValue(field?.use_current_value),
    fixed_value: field?.default,
    type: InputFormField.Barcode,
  } as any;
}

/**
 * Convert calendar fields to new widget format
 */
export function convertFieldCalendar(field: any): any {
  return {
    ...convertVisualField(field),
    allow_time: !!field?.allow_time_select,
    default_value: convertDefaultValue(field?.use_current_value),
    fixed_value: field?.default,
    show_end_date: field?.hide_end_date ?? true,
    type: InputFormField.Calendar,
  } as any;
}

/**
 * Convert calendar fields to new widget format
 */
export function convertFieldCheckbox(field: any): any {
  return {
    ...convertVisualField(field),
    default_value: convertDefaultValue(field?.use_current_value),
    fixed_value: field?.default,
    type: InputFormField.Checkbox,
  } as any;
}

/**
 * Convert clock set fields to new widget format
 */
export function convertFieldClockSet(field: any): any {
  return {
    ...convertVisualField(field),
    default_value: convertDefaultValue(field?.use_current_value),
    define_limits: !!field?.enable_limit,
    fixed_value: field?.default,
    hour_visualization: field?.clock_visualization,
    maximum: field?.maximum,
    minimum: field?.minimum,
    step_value: field?.increment,
    type: InputFormField["Clock Set"],
  } as any;
}

/**
 * Convert device fields to new widget format
 */
export function convertFieldDevice(field: any): any {
  return {
    ...convertVisualField(field),
    default_value: convertDefaultValue(field?.use_current_value),
    fixed_value: field?.default,
    type: InputFormField.Device,
  } as any;
}

/**
 * Convert dropdown field to new widget format
 */
export function convertFieldDropdown(field: any): any {
  return {
    ...convertVisualField(field),
    options: (field?.options || []).map((e: any) => ({
      label: e?.label,
      value: e?.value,
      ...(e?.unit ? { unit: e?.unit } : {}),
      ...(e?.is_default ? { default: e?.is_default } : {}),
    })),
    type: InputFormField.Dropdown,
    use_values_from: field?.use_values_from === "variable" ? "variable" : "options",
    use_values_from_variable: {
      origin: field?.use_variable?.origin?.id || field?.use_variable?.origin,
      variable: field?.use_variable?.variable,
    },
  } as any;
}

/**
 * Convert dropdown multiples field to new widget format
 */
export function convertFieldDropdownMultiple(field: any): any {
  return {
    ...convertFieldDropdown(field),
    type: InputFormField["Dropdown Multiple"],
  } as any;
}

/**
 * Convert email field to new widget format
 */
export function convertFieldEmail(field: any): any {
  return {
    ...convertVisualField(field),
    amount: "single",
    default_value: convertDefaultValue(field?.use_current_value),
    fixed_value: field?.default,
    type: InputFormField.Email,
  } as any;
}

/**
 * Convert file upload field to new widget format
 */
export function convertFieldFileUpload(field: any): any {
  return {
    ...convertVisualField(field),
    maximum_files: field?.max_files || 1,
    path: field?.path || "",
    type: InputFormField["File Upload"],
    use_mobile_camera: !!field?.use_camera,
  } as any;
}

/**
 * Convert filtered variables field to new widget format
 */
export function convertFieldFilteredVariables(field: any): any {
  const useValuesFromVariable = {
    origin: field?.use_variable?.origin?.id || field?.use_variable?.origin,
    variable: field?.use_variable?.variable,
  };

  return {
    ...convertVisualField(field),
    filter_amount: field?.selection_type || "single",
    filter_origin: field?.filter_origin,
    type: InputFormField["Filtered variables"],
    use_values_from_variable: { ...useValuesFromVariable },
  } as any;
}

/**
 * Convert hidden field to new widget format
 */
export function convertFieldHidden(field: any): any {
  return {
    ...convertFormField(field),
    fixed_value: field?.value,
    type: InputFormField.Hidden,
    unit: field?.unit || "",
  } as any;
}

/**
 * Convert Image / Video select field to new widget format
 */
export function convertFieldImageVideoSelect(field: any): any {
  return {
    ...convertVisualField(field),
    allow_multiple: !!field?.allow_multiple,
    options: (field?.options || []).map((e: any) => ({
      description: e?.description || "",
      label: e?.label,
      link: e?.url || "",
      value: e?.value,
      ...(e?.unit ? { unit: e?.unit } : {}),
      ...(e?.is_default ? { default: e?.is_default } : {}),
    })),
    show_filter: !!field?.show_filter_value,
    type: InputFormField["Image / Video Select"],
    use_values_from: field?.use_values_from === "variable" ? "variable" : "options",
    use_values_from_variable: {
      origin: field?.use_variable?.origin?.id || field?.use_variable?.origin,
      variable: field?.variable,
    },
  } as any;
}

/**
 * Convert Incremental steps field for new widget format
 */
export function convertFieldIncrementalSteps(field: any): any {
  return {
    ...convertVisualField(field),
    default_value: convertDefaultValue(field?.use_current_value),
    fixed_value: field?.default,
    maximum: field?.maximum || 100,
    minimum: field?.minimum || 0,
    step_value: field?.increment || 1,
    type: InputFormField["Incremental Step"],
  } as any;
}

/**
 * Convert Number field to new widget format
 */
export function convertFieldNumber(field: any): any {
  return {
    ...convertVisualField(field),
    decimals: field?.decimals === "-1" ? "auto" : field?.decimals,
    default_value: convertDefaultValue(field?.use_current_value),
    fixed_value: field?.default,
    show_thousand_separator: !!field?.show_thousand,
    type: InputFormField.Number,
  } as any;
}

/**
 * Convert Password field to new widget format
 */
export function convertFieldPassword(field: any): any {
  return {
    ...convertVisualField(field),
    fixed_value: field?.use_current_value !== "current_value" ? field?.default : "",
    type: InputFormField.Password,
  } as any;
}

/**
 * Convert QR Code field to new widget format
 */
export function convertFieldQrCode(field: any): any {
  return {
    ...convertVisualField(field),
    default_value: convertDefaultValue(field?.use_current_value),
    fixed_value: field?.default,
    type: InputFormField["QR Code"],
  } as any;
}

/**
 * Convert Radio field to new widget format
 */
export function convertFieldRadio(field: any): any {
  return {
    ...convertVisualField(field),
    options: (field?.options || []).map((e: any) => ({
      label: e?.label,
      value: e?.value,
      ...(e?.unit ? { unit: e?.unit } : {}),
      ...(e?.is_default ? { default: e?.is_default } : {}),
    })),
    type: InputFormField.Radio,
  } as any;
}

/**
 * Convert Validation field to new widget format
 */
export function convertFieldValidation(field: any): any {
  return {
    ...convertFormField(field),
    fade_out: !field?.validation_message?.always_show,
    keep_last_validation: false,
    show_markdown: false,
    type: InputFormField.Validation,
  } as any;
}

/**
 * Convert Capture user field to new widget format
 */
export function convertFieldCaptureUser(field: any): any {
  return {
    ...convertFormField(field),
    field: field?.field || "",
    type: InputFormField["Capture user"],
  } as any;
}

/**
 * Convert fields
 */
export function convertField(field: any, showMap?: any): any {
  const { fieldtype } = field;
  switch (fieldtype) {
    case "text":
      return convertFieldText(field);
    case "address":
      return convertFieldAddress(field, showMap);
    case "barcode":
      return convertFieldBarCode(field);
    case "calendar":
      return convertFieldCalendar(field);
    case "checkbox":
      return convertFieldCheckbox(field);
    case "clock-set":
      return convertFieldClockSet(field);
    case "device":
      return convertFieldDevice(field);
    case "dropdown":
      return convertFieldDropdown(field);
    case "dropdown-multi":
      return convertFieldDropdownMultiple(field);
    case "email":
      return convertFieldEmail(field);
    case "upload":
      return convertFieldFileUpload(field);
    case "filtered":
      return convertFieldFilteredVariables(field);
    case "hidden":
      return convertFieldHidden(field);
    case "image-select":
      return convertFieldImageVideoSelect(field);
    case "incremental-step":
      return convertFieldIncrementalSteps(field);
    case "number":
      return convertFieldNumber(field);
    case "password":
      return convertFieldPassword(field);
    case "qrcode":
      return convertFieldQrCode(field);
    case "radio":
      return convertFieldRadio(field);
    case "validation":
      return convertFieldValidation(field);
    case "user":
      return convertFieldCaptureUser(field);
    default:
      return null;
  }
}
