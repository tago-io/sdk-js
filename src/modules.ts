/**
 * TagoIO SDK for JavaScript/TypeScript
 *
 * A comprehensive SDK for interacting with the TagoIO IoT platform. This module provides
 * classes and utilities for device management, data streaming, analysis execution, and
 * API resource management.
 *
 * @example Basic device usage
 * ```ts
 * import { Device } from "@tago-io/sdk";
 *
 * const device = new Device({ token: "your-device-token" });
 *
 * // Send data to your device
 * await device.sendData({
 *   variable: "temperature",
 *   value: 25.6,
 *   unit: "°C"
 * });
 *
 * // Get data from your device
 * const data = await device.getData({ variables: ["temperature"], qty: 10 });
 * ```
 *
 * @example Analysis context usage
 * ```ts
 * import { Analysis } from "@tago-io/sdk";
 *
 * const analysis = new Analysis({ token: "your-analysis-token" });
 * const environment = await analysis.getEnvironment();
 * ```
 *
 * @example API resources usage
 * ```ts
 * import { Resources } from "@tago-io/sdk";
 *
 * const resources = new Resources({ token: "your-account-token" });
 * const devices = await resources.devices.list();
 * ```
 *
 * @example Type imports
 * ```ts
 * import type { DeviceListScope, UserListScope, Data, DeviceInfo } from "@tago-io/sdk";
 * ```
 *
 * @module
 */

export * as Cache from "./common/Cache.ts";
export * as SSE from "./infrastructure/apiSSE.ts";
export { default as Analysis } from "./modules/Analysis/Analysis.ts";
export { default as Authorization } from "./modules/Authorization/Authorization.ts";
export { default as Device } from "./modules/Device/Device.ts";
export { default as Dictionary } from "./modules/Dictionary/Dictionary.ts";
export { default as Migration } from "./modules/Migration/Migration.ts";
export { default as Network } from "./modules/Network/Network.ts";
export { default as Account } from "./modules/Resources/AccountDeprecated.ts";
export { default as Resources } from "./modules/Resources/Resources.ts";
export { default as RunUser } from "./modules/RunUser/RunUser.ts";
export { default as Services } from "./modules/Services/Services.ts";
export * as Utils from "./modules/Utils/Utils.ts";
export type { Regions, RegionsObj } from "./regions.ts";
export { regionsDefinition } from "./regions.ts";

export type * from "./types.ts";
