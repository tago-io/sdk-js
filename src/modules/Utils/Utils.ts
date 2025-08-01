/**
 * Utility functions for TagoIO SDK
 *
 * This module provides a collection of utility functions commonly needed when
 * working with TagoIO, including environment parsing, file uploads, device
 * management, and analysis routing.
 *
 * @example Environment parsing
 * ```ts
 * import { Utils } from "@tago-io/sdk";
 *
 * // Parse environment variables to JSON
 * const config = Utils.envToJson(process.env.CONFIG);
 *
 * // Get device by name
 * const device = await Utils.getDevice("My Device");
 * ```
 *
 * @example File operations
 * ```ts
 * // Upload file to TagoIO
 * const fileInfo = await Utils.uploadFile({
 *   filename: "data.csv",
 *   buffer: csvBuffer
 * });
 * ```
 *
 * @example Analysis routing
 * ```ts
 * const router = new Utils.AnalysisRouter();
 * router.register("temperature", temperatureHandler);
 * router.register("humidity", humidityHandler);
 * ```
 *
 * @module
 */

export { default as envToJson } from "./envToJson.ts";
export { default as getAPIVersion } from "./getAPIVersion.ts";
export { default as getDevice } from "./getDevice.ts";
export { default as getTokenByName } from "./getTokenByName.ts";
export { default as parseLorawanQRCode } from "./parseLorawanQRCode.ts";
export { default as AnalysisRouter } from "./router/router.ts";
export { default as sendDownlink } from "./sendDownlink.ts";
export { default as updateMultipleDropdown } from "./updateMultipleDropdown.ts";
export { default as uploadFile } from "./uploadFile.ts";
