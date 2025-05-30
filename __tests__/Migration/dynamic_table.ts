import { convert, dynamicTableConfig, isOldStructure } from "../../src/modules/Migration/dynamic_table";
import * as oldStructure from "./__mocks__/widgetsOldStructure.json";

const oldWidget1 = oldStructure.dynamicTableStructure;
const oldWidget2 = oldStructure.dynamicTableStructure2;

describe("Dynamic table widget - migration suite", () => {
  /**
   * Tests to see if the root properties have been transferred properly.
   */
  it("converts base structure properly", () => {
    const newStructure = convert(oldWidget1);

    expect(newStructure.label).toEqual(oldWidget1.label);
    expect(newStructure.id).toEqual(oldWidget1.id);
    expect(newStructure.realtime).toEqual(oldWidget1.realtime);
    expect(newStructure.analysis_run).toEqual(oldWidget1.analysis_run);
    expect(newStructure.dashboard).toEqual(oldWidget1.dashboard);
    expect(newStructure.type).toEqual("dynamic_table");
  });

  /**
   * Tests to see if the root properties have been transferred properly.
   */
  it("converts base structure properly - 2", () => {
    const newStructure = convert(oldWidget2);

    expect(newStructure.label).toEqual(oldWidget2.label);
    expect(newStructure.id).toEqual(oldWidget2.id);
    expect(newStructure.realtime).toEqual(oldWidget2.realtime);
    expect(newStructure.analysis_run).toEqual(oldWidget2.analysis_run);
    expect(newStructure.dashboard).toEqual(oldWidget2.dashboard);
    expect(newStructure.type).toEqual("dynamic_table");
  });

  /**
   * Tests to see if most display properties were transferred.
   */
  it("converts most display properties properly", () => {
    const newStructure = convert(oldWidget1);

    expect(newStructure.display.max_rows).toEqual(oldWidget1.display.max_rows);
    expect(newStructure.display.show_search).toEqual(oldWidget1.display.show_search);
    expect(newStructure.display.header_buttons).toEqual(oldWidget1.display.header_buttons);
    expect(newStructure.display.help).toEqual(oldWidget1.display.help);
    expect(newStructure.display.show_time).toEqual(oldWidget1.display.show_time);
    expect(newStructure.display.variables).toBeTruthy();
    expect(newStructure.display.search_position).toEqual("whole");
  });

  /**
   * Tests if the date column is being created accordingly.
   */
  it("creates date column correctly", () => {
    const newStructure = convert(oldWidget1);
    const dateColumn = newStructure.display.variables.find((x: any) => x.is_date);

    expect(newStructure.display.show_time).toBe(true);
    expect(dateColumn).toEqual(dynamicTableConfig.defaultDateColumn);
  });

  /**
   * Tests if the date column is being created accordingly.
   */
  it("doesn't create date column if show_time = false", () => {
    const tempWidget = {
      ...oldWidget1,
      display: {
        ...oldWidget1.display,
        show_time: false,
      },
    };

    const newStructure = convert(tempWidget);
    const dateColumn = newStructure.display.variables.find((x: any) => x.is_date);

    expect(newStructure.display.show_time).toBe(false);
    expect(dateColumn).toBeFalsy();
  });

  /**
   * Tests if the control column is being created accordingly.
   */
  it("creates control column correctly", () => {
    const newStructure = convert(oldWidget1);
    const controlColumn = newStructure.display.variables.find((x: any) => x.is_control);

    expect(newStructure.display.show_control).toBe(true);
    expect(controlColumn).toBeTruthy();
    expect(controlColumn.show_delete).toEqual(oldWidget1.display.show_delete);
    expect(controlColumn.show_edit).toEqual(true);
    expect(controlColumn.show_edit_modal).toEqual(oldWidget1.display.show_edit_modal);

    if (oldWidget1.display.messageDeleteRow) {
      expect(controlColumn.delete_message).toEqual(oldWidget1.display.messageDeleteRow);
    } else {
      expect(controlColumn.delete_message).toEqual("Do you really want to delete this row?");
    }
  });

  /**
   * Tests if the control column is being created accordingly.
   */
  it("creates control column correctly - 2", () => {
    const newStructure = convert(oldWidget2);
    const controlColumn = newStructure.display.variables.find((x: any) => x.is_control);

    expect(newStructure.display.show_control).toBe(false);
    expect(controlColumn).toBeFalsy();
  });

  /**
   * Tests if intervals are being converted correctly.
   */
  it("converts intervals properly", () => {
    const newStructure = convert(oldWidget1);

    expect(newStructure.display.intervals || []).toHaveLength(3);
    expect(newStructure.display.intervals[0]).toEqual("1 hour");
    expect(newStructure.display.intervals[1]).toEqual("2 week");
    expect(newStructure.display.intervals[2]).toEqual("3 year");
  });

  /**
   * Tests if intervals are being converted correctly.
   */
  it("converts intervals properly - 2", () => {
    const newStructure = convert(oldWidget2);

    expect(newStructure.display.intervals || []).toHaveLength(2);
    expect(newStructure.display.intervals[0]).toEqual("30 min");
    expect(newStructure.display.intervals[1]).toEqual("1 hour");
  });

  /**
   * Tests if the watermark was removed.
   */
  it("doesn't have watermark anymore", () => {
    const newStructure = convert(oldWidget1) as any;

    expect(newStructure.watermark).toBeUndefined();
  });

  /**
   * Tests if the data statys the same (it should).
   */
  it("converts data properly (stays the same)", () => {
    const newStructure = convert(oldWidget1);

    expect(newStructure.data).toEqual(oldWidget1.data);
  });

  /**
   * Tests if the data statys the same (it should).
   */
  it("converts data properly (stays the same) - 2", () => {
    const newStructure = convert(oldWidget2);

    expect(newStructure.data).toEqual(oldWidget2.data);
  });

  /**
   * Tests if the variables were converted correctly.
   */
  it("converts variables correctly", () => {
    const newStructure = convert(oldWidget1);

    // two variables, one datetime, one control:
    expect(newStructure.display.variables).toHaveLength(4);

    const firstColumn = newStructure.display.variables[0];
    expect(firstColumn.alias).toEqual("value");
    expect(firstColumn.alignment).toEqual("center");
    expect(firstColumn.override_color).toEqual(true);
    expect(firstColumn.allow_resize).toEqual(true);
    expect(firstColumn.id).toEqual("data:id:1");
    expect(firstColumn.data).toBeTruthy();

    const secondColumn = newStructure.display.variables[1];
    expect(secondColumn.alias).toEqual("value2");
    expect(secondColumn.alignment).toEqual("left");
    expect(secondColumn.override_color).toEqual(true);
    expect(secondColumn.allow_resize).toEqual(true);
    expect(secondColumn.id).toEqual("data:id:2");
    expect(secondColumn.data).toBeTruthy();

    const thirdColumn = newStructure.display.variables[2];
    expect(thirdColumn.is_date).toBe(true);

    const fourthColumn = newStructure.display.variables[3];
    expect(fourthColumn.is_control).toBe(true);
  });

  /**
   * Tests if the variables were converted correctly.
   */
  it("converts variables correctly - 2", () => {
    const newStructure = convert(oldWidget2);

    // two variables, one datetime, one control:
    expect(newStructure.display.variables).toHaveLength(2);

    const firstColumn = newStructure.display.variables[0];
    expect(firstColumn.alias).toEqual("teste");
    expect(firstColumn.alignment).toEqual("left");
    expect(firstColumn.override_color).toEqual(true);
    expect(firstColumn.allow_resize).toEqual(true);
    expect(firstColumn.id).toEqual("data:id:1");
    expect(firstColumn.data).toEqual({
      origin: "originId",
      variable: "value",
    });

    const secondColumn = newStructure.display.variables[1];
    expect(secondColumn.is_date).toBe(true);
    expect(secondColumn).toEqual(dynamicTableConfig.defaultDateColumn);
  });

  /**
   * Tests if the variables' alignments were converted correctly.
   */
  it("converts variable alignment correctly", () => {
    const tempWidget = {
      ...oldWidget1,
      display: {
        ...oldWidget1.display,
        column_alignments: {
          originId2value: "",
        },
      },
    };

    const newStructure = convert(tempWidget);
    const variable = newStructure.display.variables[0];
    expect(variable.alignment).toEqual("left");
  });

  /**
   * Tests if the variables' edits were converted correctly.
   */
  it("converts variable edits correctly", () => {
    const newStructure = convert(oldWidget1);

    const firstColumn = newStructure.display.variables[0];
    expect(firstColumn.edit).toBeTruthy();
    expect(firstColumn.edit.enabled).toBe(true);
    expect(firstColumn.edit.required).toBe(true);
    expect(firstColumn.edit.type).toBe("dropdown");
    expect(firstColumn.edit.options).toEqual([{ value: "aaa" }]);
    expect(firstColumn.edit.use_values_from).toBeUndefined();
    expect(firstColumn.edit.use_values_from_variable).toEqual({
      origin: "originId",
      variable: "altitude",
    });

    const secondColumn = newStructure.display.variables[1];
    expect(secondColumn.edit).toBeTruthy();
    expect(secondColumn.edit.enabled).toBe(false);
    expect(secondColumn.edit.required).toBe(false);
    expect(secondColumn.edit.show_label).toBe(true);
    expect(secondColumn.edit.type).toBe("dropdown");
    expect(secondColumn.edit.options).toEqual([{ label: "aaa", value: "bbb" }]);

    const thirdColumn = newStructure.display.variables[2];
    expect(thirdColumn.edit).toBeFalsy();

    const fourthColumn = newStructure.display.variables[3];
    expect(fourthColumn.edit).toBeFalsy();
  });

  /**
   * Tests to see if the structure is old or new.
   */
  it("correctly identifies if it's new structure or old", () => {
    expect(isOldStructure(convert(oldWidget1))).toEqual(false);
    expect(isOldStructure(oldWidget1)).toEqual(true);

    expect(isOldStructure(convert(oldWidget2))).toEqual(false);
    expect(isOldStructure(oldWidget2)).toEqual(true);
  });

  /**
   * Test if the header buttons, or help buttons are undefined
   */
  it("correctly identifies when header_buttons or help is undefined", () => {
    // Testing when is just row or column deleted
    const copyOfOld1 = Object.assign({ ...oldWidget1 }, {});
    delete copyOfOld1.display.header_buttons;
    delete copyOfOld1.display.help;

    const newStructure1 = convert(copyOfOld1);
    expect(newStructure1.display).not.toBeFalsy();
    expect(newStructure1.display.header_buttons).toEqual([]);
    expect(newStructure1.display.help).toEqual("");
    expect(isOldStructure(newStructure1)).toEqual(false);
  });
});
