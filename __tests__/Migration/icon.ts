import { convert, isOldStructure } from "../../src/modules/Migration/icon";
import * as oldStructure from "./__mocks__/widgetsOldStructure.json";

const oldWidget = oldStructure.iconStructure;

describe("Icon widget - migration suite", () => {
  /**
   * Tests to see if the root properties have been transferred properly.
   */
  it("converts base structure properly", () => {
    const newStructure = convert(oldWidget);

    expect(newStructure.label).toEqual(oldWidget.label);
    expect(newStructure.id).toEqual(oldWidget.id);
    expect(newStructure.dashboard).toEqual(oldWidget.dashboard);
    expect(newStructure.type).toEqual("icon");
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
   * Test if the _position was deleted
   */
  it("correctly identifies if _position was deleted", () => {
    const newStructure = convert(oldWidget);
    const newVariables = newStructure.display.variables.filter((e: any) => e?._position);

    expect(newVariables).toHaveLength(0);
  });
  /**
   * Tests when there is not column or row in the layout icon's structure
   */
  it("correctly identifies when column or row is undefined", () => {
    // Testing when is just row or column deleted
    const copyOfOld1 = Object.assign({ ...oldWidget }, {});
    delete copyOfOld1.display.layout["originIdtemperature4"].row;
    delete copyOfOld1.display.layout["originIdtemperature2"].column;

    const newStructure1 = convert(copyOfOld1);
    expect(newStructure1.display).not.toBeFalsy();
    expect(newStructure1.display.header_buttons).toEqual(oldWidget.display.header_buttons);
    expect(newStructure1.display.help).toEqual(oldWidget.display.help);
    expect(isOldStructure(newStructure1)).toEqual(false);

    // Test when is both row and column deleted
    const copyOfOld2 = Object.assign({ ...oldWidget }, {});
    delete copyOfOld1.display.layout["originIdtemperature4"].row;
    delete copyOfOld1.display.layout["originIdtemperature4"].column;

    const newStructure2 = convert(copyOfOld2);
    expect(newStructure2.display).not.toBeFalsy();
    expect(newStructure2.display.header_buttons).toEqual(oldWidget.display.header_buttons);
    expect(newStructure2.display.help).toEqual(oldWidget.display.help);
    expect(isOldStructure(newStructure2)).toEqual(false);
  });

  /**
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
