// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Converts the OLD RANGE to BLUEPRINT RANGE
// ? ====================================================================================

const isNumber = (s: any): boolean => {
  const str = ("" + s).trim();
  if (str.length === 0) {
    return false;
  }
  return !isNaN(+str);
};

function convertRange(oldWidgetDisplay: any): any {
  const range: any = {};

  if (oldWidgetDisplay.range_limit === "metadata") {
    range.type = "metadata";
    if (oldWidgetDisplay.range_limit_metadata === "custom") {
      range.metadata_origin = "variable";
      const oldVariable = oldWidgetDisplay.range_limit_variable;
      const variable = {
        origin: oldVariable.origin?.id || oldVariable?.origin,
        variable: oldVariable?.variable,
      };
      range.variable = variable;
    } else {
      range.metadata_origin = oldWidgetDisplay.range_limit_metadata === "origin" ? "original" : "formula";
    }
  } else {
    range.type = "minmax";
    const min = oldWidgetDisplay.minimum;
    const max = oldWidgetDisplay.maximum;
    range.minimum = min !== undefined && isNumber(min) ? Number(min) : 0;
    range.maximum = max !== undefined && isNumber(max) ? Number(max) : 100;
  }

  return range;
}

export default convertRange;
