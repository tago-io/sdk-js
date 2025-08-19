import TagoIOModule from "../../common/TagoIOModule.ts";
import type { WidgetInfo } from "../Resources/dashboards.types.ts";
import { convert as convertAngular, isOldStructure as isOldStructureAngular } from "./angular.ts";
import { convert as convertAreaChart, isOldStructure as isOldStructureAreaChart } from "./areachart.ts";
import { convert as convertCard, isOldStructure as isOldStructureCard } from "./card.ts";
import { convert as convertClock, isOldStructure as isOldStructureClock } from "./clock.ts";
import { convert as convertCompose, isOldStructure as isOldStructureCompose } from "./compose.ts";
import { convert as convertCustom, isOldStructure as isOldStructureCustom } from "./custom.ts";
import { convert as convertCylinder, isOldStructure as isOldStructureCylinder } from "./cylinder.ts";
import { convert as convertDial, isOldStructure as isOldStructureDial } from "./dial.ts";
import { convert as convertDisplay, isOldStructure as isOldStructureDisplay } from "./display.ts";
import { convert as convertDynamicTable, isOldStructure as isOldStructureDynamicTable } from "./dynamic_table.ts";
import { convert as convertGrainBin, isOldStructure as isOldStructureGrainBin } from "./grainbin.ts";
import { convert as convertHeatMap, isOldStructure as isOldStructureHeatMap } from "./heatmap.ts";
import {
  convert as convertHorizontalBarChart,
  isOldStructure as isOldStructureHorizontalBarChart,
} from "./horizontalbarchart.ts";
import { convert as convertIcon, isOldStructure as isOldStructureIcon } from "./icon.ts";
import { convert as convertImage, isOldStructure as isOldStructureImage } from "./image.ts";

/**
 * Dashboard widget migration utilities
 *
 * This class provides functionality for migrating legacy dashboard widgets to
 * new formats and structures. Handles conversion of old widget configurations
 * to modern widget specifications across all widget types.
 *
 * @example Basic migration
 * ```ts
 * import { Migration } from "@tago-io/sdk";
 *
 * const migration = new Migration();
 *
 * // Check if widget needs migration
 * const needsMigration = migration.isOldStructure(oldWidget);
 *
 * // Convert old widget to new format
 * if (needsMigration) {
 *   const newWidget = migration.convert(oldWidget);
 * }
 * ```
 *
 * @example Batch migration
 * ```ts
 * const widgets = await dashboard.getWidgets();
 * const migratedWidgets = widgets.map(widget => {
 *   return migration.isOldStructure(widget)
 *     ? migration.convert(widget)
 *     : widget;
 * });
 * ```
 */
import {
  convert as convertImageMarker,
  convertLayerData,
  isOldStructure as isOldStructureImageMarker,
} from "./imagemarker.ts";
import { convert as convertInputControl, isOldStructure as isOldStructureInputControl } from "./inputcontrol.ts";
import { convert as convertInputForm, isOldStructure as isOldStructureInputForm } from "./inputform.ts";
import { convert as convertKeypad, isOldStructure as isOldStructureKeypad } from "./keypad.ts";
import { convert as convertLineChart, isOldStructure as isOldStructureLineChart } from "./linechart.ts";
import { convert as convertMap, isOldStructure as isOldStructureMap } from "./map.ts";
import {
  convert as convertMultipleAxisChart,
  isOldStructure as isOldStructureMultipleAxisChart,
} from "./multipleaxischart.ts";
import { convert as convertNote, isOldStructure as isOldStructureNote } from "./note.ts";
import { convert as convertPie, isOldStructure as isOldStructurePie } from "./pie.ts";
import { convert as convertPushButton, isOldStructure as isOldStructurePushButton } from "./pushbutton.ts";
import { convert as convertSemiDonut, isOldStructure as isOldStructureSemiDonut } from "./semidonut.ts";
import { convert as convertSolid, isOldStructure as isOldStructureSolid } from "./solid.ts";
import { convert as convertStaticTable, isOldStructure as isOldStructureStaticTable } from "./statictable.ts";
import { convert as convertStepButton, isOldStructure as isOldStructureStepButton } from "./stepbutton.ts";
import { convert as convertTile, isOldStructure as isOldStructureTile } from "./tile.ts";
import {
  convert as convertVerticalBarChart,
  isOldStructure as isOldStructureVerticalBarChart,
} from "./verticalbarchart.ts";
import { convert as convertVideo, isOldStructure as isOldStructureVideo } from "./video.ts";
import { convert as convertVuMeter, isOldStructure as isOldStructureVuMeter } from "./vumeter.ts";

class Migration extends TagoIOModule<any> {
  public static convertImagerMarkerData(widget: any, widgetData: any): any[] {
    return convertLayerData(widget, widgetData);
  }
  /**
   * Returns if the widget type is supported by migration
   */
  public static hasMigrate(widget: any): boolean {
    const { type } = widget || {};
    const { gauge_type, chart_type, layer_type } = widget?.display || {};

    switch (type) {
      case "pie":
        return true;
      case "note":
        return true;
      case "cylinder":
        return true;
      case "display":
        return true;
      case "table":
        return true;
      case "iframe":
        return true;
      case "dial":
        return true;
      case "gauge":
        if (gauge_type === "angular") {
          return true;
        }
        if (gauge_type === "solid") {
          return true;
        }
        if (gauge_type === "clock") {
          return true;
        }
        if (gauge_type === "vu_meter") {
          return true;
        }
        if (gauge_type === "dial") {
          return true;
        }
        return false;
      case "chart":
        if (chart_type === "spline") {
          return true;
        }
        if (chart_type === "area") {
          return true;
        }
        if (chart_type === "bar_horizontal") {
          return true;
        }
        if (chart_type === "bar_vertical") {
          return true;
        }
        if (chart_type === "multiple_axis") {
          return true;
        }
        return false;
      case "card":
        return true;
      case "tile":
        return true;
      case "keypad":
        return true;
      case "incremental_button":
      case "step_button":
        return true;
      case "push_button":
        return true;
      case "input":
        return true;
      case "icon":
        return true;
      case "map":
        return true;
      case "media":
      case "image":
        return true;
      case "layer":
        if (layer_type === "heat_map") {
          return true;
        }
        if (layer_type === "image_marker") {
          return true;
        }
        if (layer_type === "compose") {
          return true;
        }
        if (layer_type === "virtualization_layer") {
          return true;
        }
        return false;
      case "grainbin":
        return true;
      default:
        return false;
    }
  }

  /**
   * Check if a widget structure is old or not,
   * based on his type
   */
  public static isOldStructure(widget: any): boolean {
    const { type } = widget || {};
    const { gauge_type, chart_type, input_type, layer_type, type_media } = widget?.display || {};

    switch (type) {
      case "pie":
        return widget?.display?.pie_type === "circle" ? isOldStructurePie(widget) : isOldStructureSemiDonut(widget);
      case "note":
        return isOldStructureNote(widget);
      case "cylinder":
        return isOldStructureCylinder(widget);
      case "display":
        return isOldStructureDisplay(widget);
      case "table":
        return widget?.display?.table_type === "dynamic"
          ? isOldStructureDynamicTable(widget)
          : isOldStructureStaticTable(widget);
      case "iframe":
        return isOldStructureCustom(widget);
      case "dial":
        return isOldStructureDial(widget);
      case "gauge":
        if (gauge_type === "angular") {
          return isOldStructureAngular(widget);
        }
        if (gauge_type === "solid") {
          return isOldStructureSolid(widget);
        }
        if (gauge_type === "clock") {
          return isOldStructureClock(widget);
        }
        if (gauge_type === "vu_meter") {
          return isOldStructureVuMeter(widget);
        }
        if (gauge_type === "dial") {
          return isOldStructureDial(widget);
        }
        return widget;
      case "chart":
        if (chart_type === "spline") {
          return isOldStructureLineChart(widget);
        }
        if (chart_type === "area") {
          return isOldStructureAreaChart(widget);
        }
        if (chart_type === "bar_horizontal") {
          return isOldStructureHorizontalBarChart(widget);
        }
        if (chart_type === "bar_vertical") {
          return isOldStructureVerticalBarChart(widget);
        }
        if (chart_type === "multiple_axis") {
          return isOldStructureMultipleAxisChart(widget);
        }
        return widget;
      case "card":
        return isOldStructureCard(widget);
      case "tile":
        return isOldStructureTile(widget);
      case "keypad":
        return isOldStructureKeypad(widget);
      case "incremental_button":
      case "step_button":
        return isOldStructureStepButton(widget);
      case "push_button":
        return isOldStructurePushButton(widget);
      case "input":
        return input_type === "form" ? isOldStructureInputForm(widget) : isOldStructureInputControl(widget);
      case "icon":
        return isOldStructureIcon(widget);
      case "map":
        return isOldStructureMap(widget);
      case "media":
      case "image":
        if (type_media === "static_video") {
          return isOldStructureVideo(widget);
        }
        return isOldStructureImage(widget);
      case "layer":
        if (layer_type === "heat_map") {
          return isOldStructureHeatMap(widget);
        }
        if (layer_type === "image_marker") {
          return isOldStructureImageMarker(widget);
        }
        if (layer_type === "compose") {
          return isOldStructureCompose(widget);
        }
        if (layer_type === "virtualization_layer") {
          return isOldStructureCompose(widget);
        }
        return widget;
      case "grainbin":
        return isOldStructureGrainBin(widget);
      default:
        return false;
    }
  }

  /**
   * Convert widget old structure to new one
   */
  public static convertWidget(widget: any): WidgetInfo {
    const { type } = widget || {};
    const { gauge_type, layer_type, chart_type, input_type, type_media } = widget?.display || {};

    switch (type) {
      case "pie":
        return widget?.display?.pie_type === "circle" ? convertPie(widget) : convertSemiDonut(widget);
      case "note":
        return convertNote(widget);
      case "cylinder":
        return convertCylinder(widget);
      case "display":
        return convertDisplay(widget);
      case "table":
        return widget?.display?.table_type === "dynamic" ? convertDynamicTable(widget) : convertStaticTable(widget);
      case "iframe":
        return convertCustom(widget);
      case "dial":
        return convertDial(widget);
      case "gauge":
        if (gauge_type === "angular") {
          return convertAngular(widget);
        }
        if (gauge_type === "solid") {
          return convertSolid(widget);
        }
        if (gauge_type === "clock") {
          return convertClock(widget);
        }
        if (gauge_type === "vu_meter") {
          return convertVuMeter(widget);
        }
        if (gauge_type === "dial") {
          return convertDial(widget);
        }
        return widget;
      case "chart":
        if (chart_type === "spline") {
          return convertLineChart(widget);
        }
        if (chart_type === "area") {
          return convertAreaChart(widget);
        }
        if (chart_type === "bar_horizontal") {
          return convertHorizontalBarChart(widget);
        }
        if (chart_type === "bar_vertical") {
          return convertVerticalBarChart(widget);
        }
        if (chart_type === "multiple_axis") {
          return convertMultipleAxisChart(widget);
        }
        return widget;
      case "card":
        return convertCard(widget);
      case "tile":
        return convertTile(widget);
      case "keypad":
        return convertKeypad(widget);
      case "incremental_button":
      case "step_button":
        return convertStepButton(widget);
      case "push_button":
        return convertPushButton(widget);
      case "input":
        return input_type === "form" ? convertInputForm(widget) : convertInputControl(widget);
      case "icon":
        return convertIcon(widget);
      case "map":
        return convertMap(widget);
      case "media":
      case "image":
        if (type_media === "static_video") {
          return convertVideo(widget);
        }
        return convertImage(widget);
      case "layer":
        if (layer_type === "heat_map") {
          return convertHeatMap(widget);
        }
        if (layer_type === "image_marker") {
          return convertImageMarker(widget);
        }
        if (layer_type === "compose") {
          return convertCompose(widget);
        }
        if (layer_type === "virtualization_layer") {
          return convertCompose(widget);
        }
        return widget;
      case "grainbin":
        return convertGrainBin(widget);
      default:
        return widget;
    }
  }
}

export default Migration;
