import { GenericModuleParams } from "../common/TagoIOModule";
import regions from "../regions";

const channelsWithID = ["analysis_console", "device_inspector", "device_data", "ui_dashboard"] as const;
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
  } else {
    // @ts-expect-error EventSource types from DOMLib
    return import("eventsource").then((x) => x?.default || x);
  }
}

async function createEventSource(url: URL) {
  const EventSource = await loadEventSourceLib();
  return new EventSource(url.toString());
}

function formatChannel(configuration: OpenSSEConfig) {
  const { channel } = configuration;

  if (isChannelWithID(configuration)) {
    return `${channel}.${configuration.resource_id}`;
  }

  return channel;
}

async function openSSEListening(params: OpenSSEConfig & GenericModuleParams): Promise<EventSource> {
  const { region, token } = params;

  const url = new URL(regions(region).sse);
  url.pathname = "/events";
  url.searchParams.set("channel", formatChannel(params));
  url.searchParams.set("token", token);

  return createEventSource(url);
}

async function openMultiSSEListening(configuration: OpenSSEConfig[], options: GenericModuleParams) {
  const channels = configuration.map((channel) => formatChannel(channel)).join(",");

  const url = new URL(regions(options.region).sse);
  url.pathname = "/events";
  url.searchParams.set("channels", channels);
  url.searchParams.set("token", options.token);

  return createEventSource(url);
}

export { openSSEListening, openMultiSSEListening, channels };
export type { OpenSSEConfig };
