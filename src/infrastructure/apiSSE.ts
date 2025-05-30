import type { GenericModuleParams } from "../common/TagoIOModule";
import regions from "../regions";

const channelsWithID = ["analysis_console", "device_inspector", "device_data", "entity_data", "ui_dashboard"] as const;
const channelsWithoutID = ["analysis_trigger", "notification", "ui"] as const;
const channels = [...channelsWithID, ...channelsWithoutID] as const;

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
  if (globalThis.EventSource) {
    return globalThis.EventSource;
  }

  // @ts-expect-error EventSource types from DOMLib
  return import("eventsource").then((x) => x?.EventSource || x);
}

function formatChannel(configuration: OpenSSEConfig) {
  const { channel } = configuration;

  if (isChannelWithID(configuration)) {
    return `${channel}.${configuration.resource_id}`;
  }

  return channel;
}

async function openSSEListening(channels: OpenSSEConfig | OpenSSEConfig[], options: GenericModuleParams) {
  let channelsParam = "";
  if (Array.isArray(channels)) {
    channelsParam = channels.map((channel) => formatChannel(channel)).join(",");
  } else {
    channelsParam = formatChannel(channels);
  }

  const url = new URL(regions(options.region).sse);
  url.pathname = "/events";
  url.searchParams.set("channels", channelsParam);
  url.searchParams.set("token", options.token);

  const EventSource = await loadEventSourceLib();
  const connection = new EventSource(url.toString());

  return connection;
}

export { openSSEListening, channels };
export type { OpenSSEConfig };
