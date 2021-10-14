import envToJson from "./envToJson";
import getAPIVersion from "./getAPIVersion";
import getTokenByName from "./getTokenByName";
import AnalysisRouter from "./router/router";
import getDevice from "./getDevice";
import uploadFile from "./uploadFile";
import sendDownlink from "./sendDownlink";
import updateMultipleDropdown from "./updateMultipleDropdown";
import parseLorawanQRCode from "./parseLorawanQRCode";

const Utils = {
  envToJson,
  getAPIVersion,
  getTokenByName,
  AnalysisRouter,
  getDevice,
  uploadFile,
  sendDownlink,
  updateMultipleDropdown,
  parseLorawanQRCode,
};

export default Utils;
