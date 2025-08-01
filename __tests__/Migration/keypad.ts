import { convert, isOldStructure } from "../../src/modules/Migration/keypad.ts";
import * as oldStructure from "./__mocks__/widgetsOldStructure.json";

const oldWidget = oldStructure.keypadStructure;

describe("Keypad widget - migration suite", () => {
  /**
   * Tests to see if the root properties have been transferred properly.
   */
  it("converts base structure properly", () => {
    const newStructure = convert(oldWidget);

    expect(newStructure.label).toEqual(oldWidget.label);
    expect(newStructure.id).toEqual(oldWidget.id);
    expect(newStructure.dashboard).toEqual(oldWidget.dashboard);
    expect(newStructure.type).toEqual("keypad");
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
