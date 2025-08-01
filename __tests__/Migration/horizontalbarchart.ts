import { convert, isOldStructure } from "../../src/modules/Migration/horizontalbarchart.ts";
import * as oldStructure from "./__mocks__/widgetsOldStructure.json";

const oldWidget = oldStructure.horizontalbarchartStructure;

describe("HorizontalBarChart widget - migration suite", () => {
  /**
   * Tests to see if the root properties have been transferred properly.
   */
  it("converts base structure properly", () => {
    const newStructure = convert(oldWidget);

    expect(newStructure.label).toEqual(oldWidget.label);
    expect(newStructure.id).toEqual(oldWidget.id);
    expect(newStructure.dashboard).toEqual(oldWidget.dashboard);
    expect(newStructure.type).toEqual("horizontal_bar_chart");
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

    const displayVariables = newStructure.display.variables;
    /**
     * Check if all the colors are different
     */
    newStructure.display.variables.map((e: any) => {
      expect(
        !displayVariables.find(
          (v: any) => v?.color === e?.color && (v?.variable !== e?.variable || v?.origin !== e?.origin)
        )
      ).toBeTruthy();
    });
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
   * Check if each variable has a color property
   */
  it("correctly insert color for each variable", () => {
    const newStructure = convert(oldWidget);
    for (const variable of newStructure.display.variables) {
      expect(!!variable.color).toBeTruthy();
    }
  });

  /**
   * Check if each variable has correct formula
   */
  it("correctly applied formula for each variable", () => {
    const customFormula: any = {
      originvariable1: {
        enable: true,
        formula_type: "dynamic",
        formula_variable: {
          origin: {
            bucket: "bucket",
            id: "origin",
            name: "My Device",
            tags: [],
          },
          variable: "variable",
        },
        unit_type: "variable",
      },
    };

    const copyOldWidget: any = {
      ...oldWidget,
      data: [
        {
          bucket: "bucket",
          origin: "origin",
          qty: 5000,
          timezone: "UTC",
          variables: ["variable1", "variable2", "variable3"],
        },
      ],
      display: {
        ...oldWidget.display,
        vars_formula: customFormula,
      },
    };

    const newStructure = convert(copyOldWidget);
    expect(newStructure.display.variables[0].formula.enable).toBeTruthy();
    expect(newStructure.display.variables[0].formula.formula_type).toEqual("variable");
    expect(newStructure.display.variables[0].formula.variable.origin).toEqual("origin");
    expect(newStructure.display.variables[0].formula.variable.variable).toEqual("variable");
    expect(newStructure.display.variables[0].formula.unit_type).toEqual("variable");

    expect(newStructure.display.variables[1].formula).toBeUndefined();
    expect(newStructure.display.variables[2].formula).toBeUndefined();
  });

  /**
   * Check if each variable has correct number format
   */
  it("correctly applied number format for each variable", () => {
    const customFormat = {
      originvariable1: {
        decimals: "3",
        show_thousand: true,
      },
      originvariable2: {
        decimals: "20",
        show_thousand: false,
      },
    };

    const copyOldWidget = {
      ...oldWidget,
      data: [
        {
          bucket: "bucket",
          origin: "origin",
          qty: 5000,
          timezone: "UTC",
          variables: ["variable1", "variable2", "variable3"],
        },
      ],
      display: {
        ...oldWidget.display,
        vars_format: customFormat,
      },
    };

    const newStructure = convert(copyOldWidget);
    expect(newStructure.display.variables[0].number_format.show_thousand).toBeTruthy();
    expect(newStructure.display.variables[0].number_format.decimals).toEqual("3");
    expect(newStructure.display.variables[1].number_format.show_thousand).toBeFalsy();
    expect(newStructure.display.variables[1].number_format.decimals).toEqual("20");
    expect(newStructure.display.variables[2].number_format).toBeUndefined();
  });

  /**
   * Check if downsample is being correctly applied
   */
  it("correctly insert downsample", () => {
    const newDisplay = {
      ...oldWidget.display,
    };

    newDisplay.downsample_enabled = undefined;
    newDisplay.downsample_factor = undefined;
    newDisplay.downsample_threshold = undefined;

    let newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.downsample.enabled).toBeFalsy();
    expect(newStructure.display.downsample.threshold).toEqual(1000);
    expect(newStructure.display.downsample.factor).toEqual(10);

    newDisplay.downsample_enabled = true;
    newDisplay.downsample_factor = 65;
    newDisplay.downsample_threshold = 10200;

    newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.downsample.enabled).toBeTruthy();
    expect(newStructure.display.downsample.threshold).toEqual(10000);
    expect(newStructure.display.downsample.factor).toEqual(50);

    newDisplay.downsample_enabled = false;
    newDisplay.downsample_factor = undefined;
    newDisplay.downsample_threshold = 8000;
    newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.downsample.enabled).toBeFalsy();
    expect(newStructure.display.downsample.threshold).toEqual(8000);
    expect(newStructure.display.downsample.factor).toEqual(10);
  });

  /**
   * Check if order by and group by are correct
   */
  it("correctly insert orderby and groupby", () => {
    const newDisplay = {
      ...oldWidget.display,
    };

    newDisplay.order_by = undefined;
    newDisplay.group_by = undefined;
    let newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.order_by).toEqual("time");
    expect(newStructure.display.group_by).toEqual("time");

    newDisplay.order_by = "serie";
    newDisplay.group_by = "time";
    newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.order_by).toEqual("serie");
    expect(newStructure.display.group_by).toEqual("time");

    newDisplay.order_by = "time";
    newDisplay.group_by = "serie";
    newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.order_by).toEqual("time");
    expect(newStructure.display.group_by).toEqual("serie");
  });

  /**
   * Check if correctly applies max points and stacked
   */
  it("correctly insert stacked and max points", () => {
    const newDisplay: any = {
      ...oldWidget.display,
    };

    newDisplay.max_points = undefined;
    newDisplay.stacked = undefined;
    let newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.max_points).toEqual(5000);
    expect(newStructure.display.stacked).toBeFalsy();

    newDisplay.max_points = 1;
    newDisplay.stacked = "realtime";
    newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.max_points).toEqual(1);
    expect(newStructure.display.stacked).toBeTruthy();
  });

  /**
   * Check if correctly convert intervals
   */
  it("correctly convert intervals", () => {
    const newDisplay: any = {
      ...oldWidget.display,
    };

    newDisplay.intervals = undefined;
    let newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.intervals).toHaveLength(0);

    newDisplay.intervals = {};
    newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.intervals).toHaveLength(0);

    newDisplay.intervals = ["1 hra", "2 wek", "3 mth", "4 yer"];
    newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.intervals).toEqual(["1 hour", "2 week", "3 month", "4 year"]);
  });

  /**
   * Check if correctly plot X-Axis
   */
  it("correctly convert X-axis", () => {
    const newDisplay: any = {
      ...oldWidget.display,
    };

    newDisplay.plot_by = undefined;
    let newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.x_axis.plot_by).toEqual("realtime");
    expect(newStructure.display.x_axis.type).toEqual("time");

    newDisplay.plot_by = "group";
    newDisplay.plot_variable_group.origin = { id: "origin" };
    newDisplay.plot_variable_group.variable = "variable";
    newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.x_axis.plot_by).toEqual("variable");
    expect(newStructure.display.x_axis.type).toEqual("group");
    expect(newStructure.display.x_axis.variable.origin).toEqual("origin");
    expect(newStructure.display.x_axis.variable.variable).toEqual("variable");

    newDisplay.plot_by = "time";
    const oldWidgetCopy: any = {
      ...oldWidget,
      display: newDisplay,
      realtime: "variable",
    };

    oldWidgetCopy.data.push({
      bucket: "bucket",
      is_global_time_data: true,
      origin: "origin",
      qty: 5000,
      timezone: "UTC",
      variables: ["variable"],
    });

    newStructure = convert(oldWidgetCopy);
    expect(newStructure.display.x_axis.plot_by).toEqual("variable");
    expect(newStructure.display.x_axis.type).toEqual("time");
    expect(newStructure.display.x_axis.variable.origin).toEqual("origin");
    expect(newStructure.display.x_axis.variable.variable).toEqual("variable");
  });

  /**
   * Check if correctly plot Y-Axis
   */
  it("correctly convert Y-axis", () => {
    const newDisplay: any = {
      ...oldWidget.display,
    };

    newDisplay.scale = undefined;
    newDisplay.y_max = undefined;
    newDisplay.y_min = undefined;
    let newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.y_axis.scale.type).toEqual("dynamic");

    newDisplay.scale = "yes";
    newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.y_axis.scale.type).toEqual("fixed");
    expect(newStructure.display.y_axis.scale.maximum).toEqual("");
    expect(newStructure.display.y_axis.scale.minimum).toEqual("");

    newDisplay.y_max = "1000";
    newDisplay.y_min = "-1000";
    newStructure = convert({ ...oldWidget, display: newDisplay });
    expect(newStructure.display.y_axis.scale.type).toEqual("fixed");
    expect(newStructure.display.y_axis.scale.maximum).toEqual("1000");
    expect(newStructure.display.y_axis.scale.minimum).toEqual("-1000");
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
