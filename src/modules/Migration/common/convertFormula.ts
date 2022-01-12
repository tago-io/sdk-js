// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Converts the OLD FORMULA to BLUEPRINT FORMULA
// ? ====================================================================================

function convertFormula(oldFormula: any): any {
  if (!oldFormula || Object.keys(oldFormula).length === 0) {
    return null;
  }

  const newFormula: any = {
    enable: oldFormula?.enable,
    formula_type: "fixed",
    unit_type: oldFormula?.unit_type,
    value: oldFormula?.formula,
  };

  if (oldFormula.unit_type) {
    // fixed, variable, origin
    newFormula.unit_type = oldFormula.unit_type;
  }

  if (oldFormula.unit) {
    // fixed unit (F, C, ...)
    newFormula.fixed_unit = oldFormula.unit;
  }

  if (oldFormula?.formula_type === "dynamic") {
    // uses variable for formula instead of value
    newFormula.formula_type = "variable";
  }

  if (oldFormula?.formula_variable) {
    const oldVariable = oldFormula.formula_variable;
    newFormula.variable = {
      origin: oldVariable.origin?.id || oldVariable?.origin,
      variable: oldVariable?.variable,
    };

    if (typeof newFormula.variable.origin !== "string") {
      // origin has to be a string. If it's not, then something went wrong
      // during the formula conversion.
      newFormula.variable = null;
    }
  }

  return newFormula;
}

export default convertFormula;
