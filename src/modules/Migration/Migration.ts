import { WidgetInfo } from "../Account/dashboards.types";
import { convert as convertAngular, isOldStructure as isOldStructureAngular } from "./angular";
import { convert as convertAreaChart, isOldStructure as isOldStructureAreaChart } from "./areachart";
import { convert as convertCard, isOldStructure as isOldStructureCard } from "./card";
import { convert as convertClock, isOldStructure as isOldStructureClock } from "./clock";
import { convert as convertCompose, isOldStructure as isOldStructureCompose } from "./compose";
import { convert as convertCustom, isOldStructure as isOldStructureCustom } from "./custom";
import { convert as convertCylinder, isOldStructure as isOldStructureCylinder } from "./cylinder";
import { convert as convertDial, isOldStructure as isOldStructureDial } from "./dial";
import { convert as convertDisplay, isOldStructure as isOldStructureDisplay } from "./display";
import { convert as convertDynamicTable, isOldStructure as isOldStructureDynamicTable } from "./dynamic_table";
import { convert as convertGrainBin, isOldStructure as isOldStructureGrainBin } from "./grainbin";
import { convert as convertHeatMap, isOldStructure as isOldStructureHeatMap } from "./heatmap";
import {
  convert as convertHorizontalBarChart,
  isOldStructure as isOldStructureHorizontalBarChart,
} from "./horizontalbarchart";
import { convert as convertIcon, isOldStructure as isOldStructureIcon } from "./icon";
import { convert as convertImage, isOldStructure as isOldStructureImage } from "./image";
import {
  convert as convertImageMarker,
  isOldStructure as isOldStructureImageMarker,
  convertLayerData,
} from "./imagemarker";
import { convert as convertInputControl, isOldStructure as isOldStructureInputControl } from "./inputcontrol";
import { convert as convertInputForm, isOldStructure as isOldStructureInputForm } from "./inputform";
import { convert as convertKeypad, isOldStructure as isOldStructureKeypad } from "./keypad";
import { convert as convertLineChart, isOldStructure as isOldStructureLineChart } from "./linechart";
import { convert as convertMap, isOldStructure as isOldStructureMap } from "./map";
import {
  convert as convertMultipleAxisChart,
  isOldStructure as isOldStructureMultipleAxisChart,
} from "./multipleaxischart";
import { convert as convertNote, isOldStructure as isOldStructureNote } from "./note";
import { convert as convertPie, isOldStructure as isOldStructurePie } from "./pie";
import { convert as convertPushButton, isOldStructure as isOldStructurePushButton } from "./pushbutton";
import { convert as convertSemiDonut, isOldStructure as isOldStructureSemiDonut } from "./semidonut";
import { convert as convertSolid, isOldStructure as isOldStructureSolid } from "./solid";
import { convert as convertStaticTable, isOldStructure as isOldStructureStaticTable } from "./statictable";
import { convert as convertStepButton, isOldStructure as isOldStructureStepButton } from "./stepbutton";
import { convert as convertTile, isOldStructure as isOldStructureTile } from "./tile";
import {
  convert as convertVerticalBarChart,
  isOldStructure as isOldStructureVerticalBarChart,
} from "./verticalbarchart";
import { convert as convertVideo, isOldStructure as isOldStructureVideo } from "./video";
import { convert as convertVuMeter, isOldStructure as isOldStructureVuMeter } from "./vumeter";
import TagoIOModule from "../../common/TagoIOModule";

class Migration extends TagoIOModule<any> {
  public static convertImagerMarkerData(widget: any, widgetData: any) {
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
        } else if (gauge_type === "solid") {
          return true;
        } else if (gauge_type === "clock") {
          return true;
        } else if (gauge_type === "vu_meter") {
          return true;
        } else if (gauge_type === "dial") {
          return true;
        }
        return false;
      case "chart":
        if (chart_type === "spline") {
          return true;
        } else if (chart_type === "area") {
          return true;
        } else if (chart_type === "bar_horizontal") {
          return true;
        } else if (chart_type === "bar_vertical") {
          return true;
        } else if (chart_type === "multiple_axis") {
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
        } else if (layer_type === "image_marker") {
          return true;
        } else if (layer_type === "compose") {
          return true;
        } else if (layer_type === "virtualization_layer") {
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
        } else if (gauge_type === "solid") {
          return isOldStructureSolid(widget);
        } else if (gauge_type === "clock") {
          return isOldStructureClock(widget);
        } else if (gauge_type === "vu_meter") {
          return isOldStructureVuMeter(widget);
        } else if (gauge_type === "dial") {
          return isOldStructureDial(widget);
        }
        return widget;
      case "chart":
        if (chart_type === "spline") {
          return isOldStructureLineChart(widget);
        } else if (chart_type === "area") {
          return isOldStructureAreaChart(widget);
        } else if (chart_type === "bar_horizontal") {
          return isOldStructureHorizontalBarChart(widget);
        } else if (chart_type === "bar_vertical") {
          return isOldStructureVerticalBarChart(widget);
        } else if (chart_type === "multiple_axis") {
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
        } else if (layer_type === "image_marker") {
          return isOldStructureImageMarker(widget);
        } else if (layer_type === "compose") {
          return isOldStructureCompose(widget);
        } else if (layer_type === "virtualization_layer") {
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
        } else if (gauge_type === "solid") {
          return convertSolid(widget);
        } else if (gauge_type === "clock") {
          return convertClock(widget);
        } else if (gauge_type === "vu_meter") {
          return convertVuMeter(widget);
        } else if (gauge_type === "dial") {
          return convertDial(widget);
        }
        return widget;
      case "chart":
        if (chart_type === "spline") {
          return convertLineChart(widget);
        } else if (chart_type === "area") {
          return convertAreaChart(widget);
        } else if (chart_type === "bar_horizontal") {
          return convertHorizontalBarChart(widget);
        } else if (chart_type === "bar_vertical") {
          return convertVerticalBarChart(widget);
        } else if (chart_type === "multiple_axis") {
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
        } else if (layer_type === "image_marker") {
          return convertImageMarker(widget);
        } else if (layer_type === "compose") {
          return convertCompose(widget);
        } else if (layer_type === "virtualization_layer") {
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
