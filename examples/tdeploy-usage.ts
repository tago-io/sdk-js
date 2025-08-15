// Example usage demonstration
import { Resources, Device } from "@tago-io/sdk";

// Example 1: Using tdeploy with Resources
const resources = new Resources({
  token: "your-account-token",
  region: {
    tdeploy: "68951c0e023862b2aea00f3f",
    api: "", // Required by RegionsObj interface, but ignored when tdeploy is present
    sse: "", // Required by RegionsObj interface, but ignored when tdeploy is present
  },
});

// Example 2: Using tdeploy with Device
const device = new Device({
  token: "your-device-token",
  region: {
    tdeploy: "68951c0e023862b2aea00f3f",
    api: "", // Required by RegionsObj interface, but ignored when tdeploy is present
    sse: "", // Required by RegionsObj interface, but ignored when tdeploy is present
  },
});

// Example 3: Backward compatibility - existing usage still works
const standardResources = new Resources({
  token: "your-account-token",
  region: "us-e1", // Still works exactly as before
});

const customRegionResources = new Resources({
  token: "your-account-token",
  region: {
    api: "https://custom-api.example.com",
    sse: "https://custom-sse.example.com",
  },
});

export { resources, device, standardResources, customRegionResources };