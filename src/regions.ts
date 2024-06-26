/**
 * @internal
 */
// let noRegionWarning = false;

interface RegionsObj {
  api: string;
  realtime: string;
  sse: string;
}

/**
 * Object of Regions Definition
 * @internal
 */
const regionsDefinition = {
  "usa-1": {
    api: "https://api.tago.io",
    realtime: "https://realtime.tago.io",
    sse: "https://sse.tago.io/events",
  },
  env: undefined as void, // ? process object should be on trycatch.
};

/**
 * Get connection URI for Realtime and API
 * @internal
 * @param region Region
 */
function getConnectionURI(region?: Regions): RegionsObj {
  const value = regionsDefinition[region];

  if (value) {
    return value;
  }

  if (region !== undefined && !region !== null && region !== "env") {
    throw new ReferenceError(`> TagoIO-SDK: Invalid region ${region}.`);
  }

  try {
    const api = process.env.TAGOIO_API;
    const realtime = process.env.TAGOIO_REALTIME;
    const sse = process.env.TAGOIO_SSE;

    if (!api && region !== "env") {
      throw "Invalid Env";
    }

    return { api, realtime, sse };
  } catch (error) {
    // if (!noRegionWarning) {
    //   console.info("> TagoIO-SDK: No region or env defined, using fallback as usa-1.");
    //   noRegionWarning = true;
    // }

    return regionsDefinition["usa-1"];
  }
}

type Regions = "usa-1" | "env";

export default getConnectionURI;
export { Regions };
