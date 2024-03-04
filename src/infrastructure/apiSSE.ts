import { GenericModuleParams } from "../common/TagoIOModule";
import regions from "../regions";

const channels = {
  deviceInspector: "device_inspector",
} as const;

type openSSEConfig = GenericModuleParams & {
  channel: keyof typeof channels;
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
  const { region, token, channel } = params;
  const url = new URL(regions(region).sse);
  url.searchParams.set("channel", channels[channel]);
  url.searchParams.set("token", token);

  const EventSource = await loadEventSourceLib();
  const connection = new EventSource(url.toString());

  return connection;
}

export { openSSEListening, channels };
export type { openSSEConfig };
