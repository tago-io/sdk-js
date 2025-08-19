import type { GenericModuleParams } from "../common/TagoIOModule.ts";
import regions from "../regions.ts";

const channelsWithID = ["analysis_console", "device_inspector", "device_data", "entity_data", "ui_dashboard"] as const;
const channelsWithoutID = ["analysis_trigger", "notification", "ui"] as const;
const channels: readonly string[] = [...channelsWithID, ...channelsWithoutID] as const;

type ChannelWithID = (typeof channelsWithID)[number];
type ChannelWithoutID = (typeof channelsWithoutID)[number];

type OpenSSEWithID = {
  channel: ChannelWithID;
  resource_id: string;
};

type OpenSSEWithoutID = {
  channel: ChannelWithoutID;
};

type OpenSSEConfig = OpenSSEWithID | OpenSSEWithoutID;

function isChannelWithID(params: OpenSSEConfig): params is OpenSSEWithID {
  return channelsWithID.includes(params.channel as ChannelWithID);
}

async function loadEventSourceLib(): Promise<typeof EventSource> {
  // Use native EventSource if available (browser, Deno)
  if (globalThis.EventSource) {
    return globalThis.EventSource;
  }

  return import("eventsource").then((x) => (x?.EventSource || x) as any);
}

function formatChannel(configuration: OpenSSEConfig) {
  const { channel } = configuration;

  if (isChannelWithID(configuration)) {
    return `${channel}.${configuration.resource_id}`;
  }

  return channel;
}

async function openSSEListening(
  channels: OpenSSEConfig | OpenSSEConfig[],
  options: GenericModuleParams
): Promise<EventSource> {
  let channelsParam = "";
  if (Array.isArray(channels)) {
    channelsParam = channels.map((channel) => formatChannel(channel)).join(",");
  } else {
    channelsParam = formatChannel(channels);
  }

  const regionData = regions(options.region);
  if (!regionData?.sse) {
    throw new Error("Invalid region configuration: missing SSE endpoint");
  }
  if (!options.token) {
    throw new Error("Token is required for SSE connection");
  }

  const url = new URL(regionData.sse);
  url.pathname = "/events";
  url.searchParams.set("channels", channelsParam);
  url.searchParams.set("token", options.token);

  const EventSource = await loadEventSourceLib();
  const connection = new EventSource(url.toString());

  return connection;
}

export { openSSEListening, channels };
export type { OpenSSEConfig };
