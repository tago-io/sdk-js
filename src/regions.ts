/**
 * @internal
 */
// let noRegionWarning = false;

/**
 * Region configuration object interface
 */
interface RegionsObj {
  /** API endpoint URL */
  api: string;
  /** Server-sent events endpoint URL */
  sse: string;
  /** TagoIO Deploy Project ID (optional) */
  tdeploy?: string;
}

/**
 * Supported TagoIO regions
 */
type Regions = "us-e1" | "eu-w1" | "env";

/**
 * Object of Regions Definition
 * @internal
 */
const regionsDefinition = {
  "us-e1": {
    api: "https://api.tago.io",
    sse: "https://sse.tago.io/events",
  },
  "eu-w1": {
    api: "https://api.eu-w1.tago.io",
    sse: "https://sse.eu-w1.tago.io/events",
  },
  env: undefined as undefined, // ? process object should be on trycatch.
};

/** Runtime region cache */
let runtimeRegion: RegionsObj | undefined;

/**
 * Get connection URI for Realtime and API
 * @internal
 * @param region Region
 */
function getConnectionURI(region?: Regions | RegionsObj): RegionsObj {
  // Handle tdeploy in RegionsObj - takes precedence
  if (region && typeof region === "object" && "tdeploy" in region && region.tdeploy) {
    const tdeploy = region.tdeploy.trim();
    if (tdeploy) {
      return {
        api: `https://api.${tdeploy}.tagoio.net`,
        sse: `https://sse.${tdeploy}.tagoio.net/events`,
      };
    }
  }

  let normalizedRegion = region;
  if (typeof normalizedRegion === "string" && (normalizedRegion as string) === "usa-1") {
    normalizedRegion = "us-e1";
  }

  const value =
    typeof normalizedRegion === "string"
      ? regionsDefinition[normalizedRegion]
      : typeof normalizedRegion === "object"
        ? normalizedRegion
        : undefined;

  if (value) {
    return value;
  }

  if (runtimeRegion) {
    return runtimeRegion;
  }

  if (region !== undefined && !region !== null && region !== "env") {
    throw new ReferenceError(`> TagoIO-SDK: Invalid region ${region}.`);
  }

  try {
    const api = process.env.TAGOIO_API;
    const sse = process.env.TAGOIO_SSE;

    if (!api && region !== "env") {
      throw "Invalid Env";
    }

    return { api: api || "", sse: sse || "" };
  } catch (_) {
    // if (!noRegionWarning) {
    //   console.info("> TagoIO-SDK: No region or env defined, using fallback as usa-1.");
    //   noRegionWarning = true;
    // }

    return regionsDefinition["us-e1"];
  }
}

/**
 * Set region in-memory to be inherited by other modules when set in the Analysis runtime
 * with `Analysis.use()`.
 *
 * @example
 *
 * ```ts
 * async function myAnalysis(context, scope) {
 *   // this uses the region defined through `use`
 *   const resources = new Resources({ token });
 *
 *   // it's still possible to override if needed
 *   const europeResources = new Resources({ token, region: "eu-w1" });
 * }
 *
 * Analysis.use(myAnalysis, { region: "us-e1" });
 * ```
 */
function setRuntimeRegion(region: RegionsObj): void {
  runtimeRegion = region;
}

export default getConnectionURI;
export type { Regions, RegionsObj };
export { regionsDefinition, setRuntimeRegion };
