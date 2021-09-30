import { InputFormField } from "../../src/modules/Migration/convertFields";
import { convert, isOldStructure } from "../../src/modules/Migration/inputform";
import * as oldStructure from "./__mocks__/widgetsOldStructure.json";

const oldWidget = oldStructure.inputformStructure;
const oldWidget2 = oldStructure.inputformCalendarStructure;
const oldWidget3 = oldStructure.inputformLegacyStructure;

describe("Input form widget - migration suite", () => {
  /**
   * Tests to see if the root properties have been transferred properly.
   */
  it("converts base structure properly", () => {
    const newStructure = convert(oldWidget);

    expect(newStructure.label).toEqual(oldWidget.label);
    expect(newStructure.id).toEqual(oldWidget.id);
    expect(newStructure.dashboard).toEqual(oldWidget.dashboard);
    expect(newStructure.type).toEqual("form");
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
    delete copyOfOld1.display.header_buttons;
    delete copyOfOld1.display.help;

    const newStructure1 = convert(copyOfOld1);
    expect(newStructure1.display).not.toBeFalsy();
    expect(newStructure1.display.header_buttons).toEqual([]);
    expect(newStructure1.display.help).toEqual("");
    expect(isOldStructure(newStructure1)).toEqual(false);
  });

  it("correctly apply show end date in calendar field", () => {
    const newStructure1: any = convert(oldWidget2);
    expect(newStructure1.display.sections[0].fields[0].type).toBe(InputFormField.Calendar);
    expect(newStructure1.display.sections[0].fields[0].show_end_date).toBeTruthy();
  });

  it("correctly apply button label", () => {
    const newStructure1: any = convert(oldWidget);
    expect(newStructure1.display.buttons[0].text).toBe(oldWidget.display.form.label_submit);
  });

  it("support correctly legacy default value come from", () => {
    const newStructure: any = convert(oldWidget3);
    expect(newStructure.display.sections[0].fields[0].default_value).toBe("last");
  });
});
