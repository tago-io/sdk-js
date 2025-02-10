/**
 * @internal
 */
// let noRegionWarning = false;

interface RegionsObj {
  api: string;
  realtime?: string;
  sse: string;
}

type Regions = "us-e1" | "eu-w1" | "env";

/**
 * Object of Regions Definition
 * @internal
 */
const regionsDefinition = {
  "us-e1": {
    api: "https://api.tago.io",
    realtime: "https://realtime.tago.io",
    sse: "https://sse.tago.io/events",
  },
  "eu-w1": {
    api: "https://api.eu-w1.tago.io",
    sse: "https://sse.eu-w1.tago.io/events",
  },
  env: undefined as void, // ? process object should be on trycatch.
};

/**
 * Get connection URI for Realtime and API
 * @internal
 * @param region Region
 */
function getConnectionURI(region?: Regions | RegionsObj): RegionsObj {
  // @ts-expect-error Fallback
  if (region === "usa-1") {
    region = "us-e1";
  }

  const value =
    typeof region === "string" ? regionsDefinition[region] : typeof region === "object" ? region : undefined;

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

    return regionsDefinition["us-e1"];
  }
}

export default getConnectionURI;
export type { Regions, RegionsObj };
export { regionsDefinition };
