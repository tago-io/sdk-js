import { convert, isOldStructure } from "../../src/modules/Migration/compose";
import * as oldStructure from "./__mocks__/widgetsOldStructure.json";

const oldWidget = oldStructure.composeStructure;

describe("Compose widget - migration suite", () => {
  /**
   * Tests to see if the root properties have been transferred properly.
   */
  it("converts base structure properly", () => {
    const newStructure = convert(oldWidget);

    expect(newStructure.label).toEqual(oldWidget.label);
    expect(newStructure.id).toEqual(oldWidget.id);
    expect(newStructure.dashboard).toEqual(oldWidget.dashboard);
    expect(newStructure.type).toEqual("compose");
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
   * Test if the override_color is always false
   * It should not be true, the legacy behavior set metadata as priority
   */
  it("correctly identifies if override_color is false", () => {
    const newStructure = convert(oldWidget);
    const checkOverride = newStructure.display.variables.filter((e: any) => e.override_color);

    expect(checkOverride).toHaveLength(0);
  });

  /**
   * Test if the icon_conditions are equals
   */
  it("correctly identifies if it's icon_conditions are equal", () => {
    const newDisplay = {
      ...oldWidget.display,
      vars_icons: {
        originvariable: {
          color: "#ff0000",
          url: "https://svg.internal.tago.io/adn.svg",
        },
        originvariable2: {
          url: "https://svg.internal.tago.io/add-square-button.svg",
        },
      },
    };

    const copyofOldWidget: any = {
      ...oldWidget,
      data: [
        {
          origin: "origin",
          variables: ["variable", "variable2"],
        },
        {
          is_hide: true,
          origin: "origin2",
          variables: ["hidden"],
        },
      ],
      display: newDisplay,
    };

    const newStructure = convert(copyofOldWidget);

    /**
     * Using filter to check each icon conditions array for
     * invalid icon conditions
     */
    const checkIcon = newStructure.display.variables.filter((e: any) => {
      const key = `${e.origin}${e.variable}`;
      const oldCondition: any = copyofOldWidget.display.vars_icons[key];
      if (oldCondition) {
        // There is an icon condition
        if (e.color_conditions[0].url === oldCondition.url && e.color_conditions[0].condition === "*") {
          const hasValidColor = oldCondition.color
            ? oldCondition.color === e.color_conditions[0].color
            : e.color_conditions[0].color === "rgb(49, 60, 70)";
          /**
           * If it returns false, it will not be counted as an
           * invalid icon condition
           */
          return !hasValidColor;
        } else {
          return true; // The icon condition is not equal.
        }
      } else if (e.color_conditions?.[0]) {
        return true; // The icon condition is not equal.
      }
      return false; // The icon condition is equal
    });

    expect(checkIcon).toHaveLength(0);
  });

  it("correctly identifies if constant values are correct", () => {
    const newDisplay: any = {
      ...oldWidget.display,
      aspect_ratio: undefined,
    };
    const newStructure = convert({ ...oldWidget, display: newDisplay });

    expect(newStructure.display.allow_add).toBeFalsy();
    expect(newStructure.display.allow_edit).toBeFalsy();
    expect(newStructure.display.allow_embed_url).toBeFalsy();
    expect(newStructure.display.allow_pin_color).toBeFalsy();
    expect(newStructure.display.allow_remove).toBeFalsy();
    expect(newStructure.display.show_last_update).toBeFalsy();
    expect(newStructure.display.object_fit).toEqual("contain");
    expect(newStructure.display.max_points).toEqual(300);
    expect(newStructure.display.pin_size).toEqual("big");
    expect(newStructure.display.aspect_ratio).toHaveLength(0);
  });

  it("correctly identifies if embed is being correctly applied in each variable", () => {
    const oldWidgetCopy = {
      ...oldWidget,
      data: [
        {
          origin: "origin",
          variables: ["variable", "variable2"],
        },
      ],
      display: {
        ...oldWidget.display,
        vars_iframe: {
          originvariable: "https://embedurl.com",
        },
      },
    };

    const newStructure = convert(oldWidgetCopy);
    expect(newStructure.display.variables[0].embed).toEqual("embedurl.com");
    expect(newStructure.display.variables[0].external_url_label).toBeUndefined();
    expect(newStructure.display.variables[1].embed).toBeUndefined();
    expect(newStructure.display.variables[1].external_url_label).toBeUndefined();
  });

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

  /*
   * Test if the header buttons, or help buttons are undefined
   */
  it("correctly identifies when header_buttons or help is undefined", () => {
    // Testing when is just row or column deleted
    const copyOfOld1 = Object.assign({ ...oldWidget }, {});
    delete copyOfOld1.display.header_buttons;
    delete copyOfOld1.display.help;

    const newStructure1 = convert(copyOfOld1);
    expect(newStructure1.display).not.toBeFalsy();
    expect(newStructure1.display.header_buttons).toEqual([]);
    expect(newStructure1.display.help).toEqual("");
    expect(isOldStructure(newStructure1)).toEqual(false);
  });
});
