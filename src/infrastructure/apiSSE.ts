import { GenericModuleParams } from "../common/TagoIOModule";
import regions from "../regions";

const readyStateClosed = 2;
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

async function* openSSEListening(params: openSSEConfig) {
  const { region, token, channel } = params;
  const url = new URL(regions(region).sse);
  url.searchParams.set("channel", channels[channel]);
  url.searchParams.set("token", token);

  const EventSource = await loadEventSourceLib();
  const connection = new EventSource(url.toString());

  try {
    // Create an iterable that will yield messages from the EventSource
    for await (const event of messageGenerator(connection)) {
      yield event;
    }
  } finally {
    connection.close();
  }
}

async function* messageGenerator(connection: EventSource): AsyncGenerator<string, void, unknown> {
  const queue: MessageEvent[] = [];
  let resolveQueueProcessed: (() => void) | null = null;

  // Function to reset the queueProcessed promise
  const resetQueueProcessed = () =>
    new Promise<void>((resolve) => {
      resolveQueueProcessed = resolve;
    });

  // Initially set the queueProcessed promise
  let queueProcessed = resetQueueProcessed();

  connection.onmessage = (event) => {
    queue.push(event);

    if (resolveQueueProcessed) {
      resolveQueueProcessed();
      // Reset resolveQueueProcessed to null to ensure it's only called once per message
      resolveQueueProcessed = null;
      // Reset the queueProcessed promise for the next message
      queueProcessed = resetQueueProcessed();
    }
  };

  connection.onerror = (event) => {
    // Handle error, potentially logging or yielding an error message
    // Note: EventSource will attempt to reconnect automatically
    console.log("Connection error, waiting for reconnection...");
    // Resolve the promise on error to ensure the generator can continue
    if (resolveQueueProcessed) {
      resolveQueueProcessed();
      resolveQueueProcessed = null;
      queueProcessed = resetQueueProcessed();
    }
  };

  try {
    while (connection.readyState !== readyStateClosed) {
      // Wait for the next message or an error
      await queueProcessed;

      while (queue.length > 0) {
        const event = queue.shift();
        if (event) {
          yield JSON.parse(event.data);
        }
      }
    }
  } finally {
    console.log("Closing EventSource connection.");
    connection.close();
  }
}

export { openSSEListening, channels };
export type { openSSEConfig };
