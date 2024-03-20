import { GenericModuleParams } from "../common/TagoIOModule";
import regions from "../regions";

const channelsWithID = ["device_inspector", "analysis_console", "ui_dashboard"] as const;
const channelsWithoutID = ["notification", "analysis_trigger", "ui"] as const;
const channels = [...channelsWithID, ...channelsWithoutID] as const;

type ChannelWithID = (typeof channelsWithID)[number];
type ChannelWithoutID = (typeof channelsWithoutID)[number];

type OpenSSEWithID = GenericModuleParams & {
  channel: ChannelWithID;
  resource_id: string;
};

type OpenSSEWithoutID = GenericModuleParams & {
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

async function openSSEListening(params: OpenSSEConfig): Promise<EventSource> {
  const { region, token } = params;

  const url = new URL(regions(region).sse);
  url.pathname = "/events";

  if (isChannelWithID(params)) {
    url.searchParams.set("channel", `${params.channel}.${params.resource_id}`);
  } else {
    url.searchParams.set("channel", `${params.channel}`);
  }

  url.searchParams.set("token", token);

  const EventSource = await loadEventSourceLib();
  const connection = new EventSource(url.toString());

  return connection;
}

export { openSSEListening, channels };
export type { OpenSSEConfig };
