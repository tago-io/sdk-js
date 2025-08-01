/**
 * EventSource stub for non-Node.js environments
 * This provides a fallback that throws a helpful error message
 * when EventSource is not available natively.
 */

class EventSourceStub {
  constructor(_url: string, _eventSourceInitDict?: EventSourceInit) {
    throw new Error(
      "EventSource is not available in this environment. " +
        "Please use a browser with native EventSource support, " +
        "or use Node.js with the 'eventsource' package installed."
    );
  }

  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSED = 2;
}

// Export both named and default for compatibility
export const EventSource: typeof EventSourceStub = EventSourceStub;
export default EventSourceStub;
