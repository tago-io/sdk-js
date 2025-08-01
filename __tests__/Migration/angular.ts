import { convert, isOldStructure } from "../../src/modules/Migration/angular.ts";
import * as oldStructure from "./__mocks__/widgetsOldStructure.json";

const oldWidget = oldStructure.angularStructure;

describe("angular widget - migration suite", () => {
  /**
   * Tests to see if the root properties have been transferred properly.
   */
  it("converts base structure properly", () => {
    const newStructure = convert(oldWidget);

    expect(newStructure.label).toEqual(oldWidget.label);
    expect(newStructure.id).toEqual(oldWidget.id);
    expect(newStructure.dashboard).toEqual(oldWidget.dashboard);
    expect(newStructure.type).toEqual("angular");
  });

  /**
   * Tests to see if some root properties have NOT been transferred.
   */
  it("should not convert data, realtime, or analysis", () => {
    const newStructure = convert(oldWidget);

    expect(newStructure.data).toEqual(oldWidget.data);
    expect(newStructure.realtime).toBeFalsy();
    expect(newStructure.analysis_run).toBeFalsy();
  });

  /**
   * Tests to see if display properties were transferred properly.
   */
  it("converts display properties", () => {
    const newStructure = convert(oldWidget);

    expect(newStructure.display).not.toBeFalsy();
    expect(newStructure.display.header_buttons).toEqual(oldWidget.display.header_buttons);
    expect(newStructure.display.help).toEqual(oldWidget.display.help);
  });

  /**
   * Tests to see if the structure is old or new.
   */
  it("correctly identifies if it's new structure or old", () => {
    const newStructure = convert(oldWidget);

    expect(isOldStructure(newStructure)).toEqual(false);
    expect(isOldStructure(oldWidget)).toEqual(true);
  });

  /**
   * Tests if using old number format works
   */
  it("correctly identifies if old number format works", () => {
    // Only first version of number format
    const newDisplay = {
      ...oldWidget.display,
      numberformat: "0.0000",
      vars_format: {},
    };

    const newStructure1 = convert({ ...oldWidget, display: newDisplay });

    expect(newStructure1.display.number_format.decimals).toEqual(4);
    expect(newStructure1.display.number_format.show_thousand).toBeFalsy();

    // Both versions
    newDisplay.vars_format = {
      ...oldWidget.display.vars_format,
    };
    const newStructure2 = convert({ ...oldWidget, display: newDisplay });
    expect(Number(newStructure2.display.number_format.decimals)).toEqual(3);
    expect(newStructure2.display.number_format.show_thousand).toBeTruthy();

    // everything undefined
    newDisplay.vars_format = undefined;
    newDisplay.numberformat = undefined;

    const newStructure3 = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure3.display.number_format.decimals).toEqual(-1);
    expect(newStructure3.display.number_format.show_thousand).toBeFalsy();
  });

  /**
   * Tests if range work
   */
  it("correctly identifies if range works", () => {
    const newDisplay = {
      ...oldWidget.display,
      maximum: "125",
      minimum: "15",
    };
    // Test if no range_limit
    newDisplay.range_limit = undefined;
    let newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.range.type).toEqual("minmax");
    expect(newStructure.display.range.maximum).toEqual(125);
    expect(newStructure.display.range.minimum).toEqual(15);

    newDisplay.range_limit = "min/max";
    newDisplay.maximum = undefined;
    newDisplay.minimum = undefined;
    newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.range.type).toEqual("minmax");
    expect(newStructure.display.range.maximum).toEqual(100);
    expect(newStructure.display.range.minimum).toEqual(0);

    newDisplay.maximum = "100";
    newDisplay.minimum = "0";
    newDisplay.range_limit = "metadata";
    newDisplay.range_limit_metadata = undefined;
    newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.range.type).toEqual("metadata");
    expect(newStructure.display.range.metadata_origin).toEqual("formula");

    newDisplay.range_limit_metadata = "custom";
    newDisplay.range_limit_variable = {
      origin: {
        bucket: "bucketId",
        id: "originId",
        name: "My Device",
        tags: [],
      },
      variable: "variable",
    };

    newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.range.type).toEqual("metadata");
    expect(newStructure.display.range.metadata_origin).toEqual("variable");
    expect(newStructure.display.range.variable.origin).toEqual("originId");
    expect(newStructure.display.range.variable.variable).toEqual("variable");
  });

  /**
   * Test if formula work
   */
  it("correctly identifies if formula works", () => {
    const customFormula: any = {
      originIdtemperature4: {
        enable: true,
        formula_type: "dynamic",
        formula_variable: {
          origin: {
            bucket: "bucketId",
            id: "originId",
            name: "My Device",
            tags: [],
          },
          variable: "variable",
        },
        unit_type: "variable",
      },
    };

    const newDisplay = {
      ...oldWidget.display,
      unit: "F",
    };

    newDisplay.vars_formula = undefined;
    let newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.formula.enable).toBeFalsy();
    expect(newStructure.display.formula.fixed_unit).toBe(newDisplay.unit);
    expect(newStructure.display.formula.unit_type).toBe("fixed");

    newDisplay.vars_formula = customFormula;
    newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.formula.enable).toBeTruthy();
    expect(newStructure.display.formula.formula_type).toBe("variable");
    expect(newStructure.display.formula.variable.variable).toBe("variable");
    expect(newStructure.display.formula.variable.origin).toBe("originId");
    expect(newStructure.display.formula.unit_type).toBe("variable");
  });

  /**
   * Test if the header buttons, or help buttons are undefined
   */
  it("correctly identifies when header_buttons or help is undefined", () => {
    // Testing when is just row or column deleted
    const copyOfOld1 = Object.assign({ ...oldWidget }, {});
    copyOfOld1.display.header_buttons = undefined;
    copyOfOld1.display.help = undefined;

    const newStructure1 = convert(copyOfOld1);
    expect(newStructure1.display).not.toBeFalsy();
    expect(newStructure1.display.header_buttons).toEqual([]);
    expect(newStructure1.display.help).toEqual("");
    expect(isOldStructure(newStructure1)).toEqual(false);
  });
});
