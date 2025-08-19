import { convert, isOldStructure } from "../../src/modules/Migration/map.ts";
import * as oldStructure from "./__mocks__/mapOldStructure.json";

const oldWidget = oldStructure.normalStructure;
const oldWidgetFilterDevice = oldStructure.filterByDevice;
const oldWidgetFilterValue = oldStructure.filterByValue;
const oldWidgetFilterVariable = oldStructure.filterByVariable;
const oldWidgetFilterVariableEmpty = oldStructure.filterByVariableEmpty;
const withoutIntervals = oldStructure.withoutIntervals;

describe("Map widget - migration suite", () => {
  /**
   * Tests to see if the root properties have been transferred properly.
   */
  it("converts base structure properly", () => {
    const newStructure = convert(oldWidget);

    expect(newStructure.label).toEqual(oldWidget.label);
    expect(newStructure.id).toEqual(oldWidget.id);
    expect(newStructure.dashboard).toEqual(oldWidget.dashboard);
    expect(newStructure.type).toEqual("map");
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
   * Tests to see if the filter was correctly migrated
   */
  describe("convert filter properties", () => {
    it("convert filter by variable", () => {
      const filterVariable = convert(oldWidgetFilterVariable);
      expect(filterVariable?.display?.filter_by).toEqual("variable");
      expect(filterVariable?.display?.filter_variables).toEqual([]);
      expect(filterVariable?.display?.custom_text?.SEARCH_FOR_FILTER).toEqual("custom text");
      expect(filterVariable?.display?.filter_list_by).toEqual("variable");
    });

    it("convert filter by variable empty", () => {
      const filterVariableEmpty = convert(oldWidgetFilterVariableEmpty);
      expect(filterVariableEmpty?.display?.filter_by).toEqual("variable");
      expect(filterVariableEmpty?.display?.filter_variables).toEqual([]);
      expect(filterVariableEmpty?.display?.custom_text?.SEARCH_FOR_FILTER).toEqual("custom text");
      expect(filterVariableEmpty?.display?.filter_list_by).toEqual("variable");
    });

    it("convert filter by value", () => {
      const filterValue = convert(oldWidgetFilterValue);
      expect(filterValue?.display?.filter_by).toEqual("value");
      expect(filterValue?.display?.filter_variables).toEqual(["location"]);
      expect(filterValue?.display?.custom_text?.SEARCH_FOR_FILTER).toEqual("custom text");
      expect(filterValue?.display?.filter_list_by).toEqual("variable");
    });

    it("convert filter by device", () => {
      const filterDevice = convert(oldWidgetFilterDevice);
      expect(filterDevice?.display?.filter_by).toEqual("device");
      expect(filterDevice?.display?.filter_variables).toEqual([]);
      expect(filterDevice?.display?.custom_text?.SEARCH_FOR_FILTER).toEqual("custom text");
      expect(filterDevice?.display?.filter_list_by).toEqual("device");
    });

    it("Convert filter by device with empty origin name", () => {
      const formatOldWidget = { ...oldWidgetFilterDevice };
      formatOldWidget.display.filter_devices = formatOldWidget.display.filter_devices.map((e) => {
        e.name = undefined;
        return e;
      });
      const filterDevice = convert(oldWidgetFilterDevice);

      expect(filterDevice?.display?.filter_by).toEqual("device");
      expect(filterDevice?.display?.filter_variables).toEqual([]);
      expect(filterDevice?.display?.custom_text?.SEARCH_FOR_FILTER).toEqual("custom text");
      // Widget created by analysis, does not has a device name
      expect(filterDevice?.display?.filter_list_by).toEqual("variable");
    });
  });

  /**
   * Tests to see if the geofence was correctly migrated
   */
  it("convert geofences properties", () => {
    const newStructure = convert(oldWidget);

    const { geofence } = newStructure.display;
    expect(geofence?.enable_user).toBeTruthy();
    expect(geofence?.events).toEqual(oldWidget?.display?.geo_events);
    expect(geofence?.limit).toEqual(10);
    expect(geofence?.type_enable_user).toEqual("all");
    expect(geofence?.events_label).toEqual("custom text");
    // Check variable
    expect(!!geofence?.variable).toBeTruthy();
    expect(!!geofence?.variable?.variable).toBeTruthy();
    expect(!!geofence?.variable?.origin).toBeTruthy();
    expect(!!geofence?.variable?.bucket).toBeTruthy();
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

  it("correctly migrate a widget that does not have interval array", () => {
    const newStructure = convert(withoutIntervals);

    expect(!isOldStructure(newStructure)).toBeTruthy();
  });
});
