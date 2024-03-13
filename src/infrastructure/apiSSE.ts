import { GenericModuleParams } from "../common/TagoIOModule";
import regions from "../regions";

const channels = {
  deviceInspector: "device_inspector",
  analysisTrigger: "analysis_trigger",
  analysisConsole: "analysis_console",
} as const;

type openSSEConfig = GenericModuleParams & {
  channel: keyof typeof channels;
  resource_id?: string;
};

async function loadEventSourceLib(): Promise<typeof EventSource> {
  if (globalThis.EventSource) {
    return globalThis.EventSource;
  } else {
    // @ts-expect-error EventSource types from DOMLib
    return import("eventsource").then((x) => x?.default || x);
  }
}

async function openSSEListening(params: openSSEConfig): Promise<EventSource> {
  const { region, token, channel, resource_id } = params;
  const url = new URL(regions(region).sse);
  url.pathname = "/events";

  if (params.resource_id) {
    url.searchParams.set("channel", `${channels[channel]}::${resource_id}`);
  } else {
    url.searchParams.set("channel", `${channels[channel]}`);
  }

  url.searchParams.set("token", token);

  const EventSource = await loadEventSourceLib();
  const connection = new EventSource(url.toString());

  return connection;
}

export { openSSEListening, channels };
export type { openSSEConfig };
