<br/>
<p align="center">
  <img src="https://assets.tago.io/tagoio/sdk.png" width="250px" alt="TagoIO"></img>
</p>

# TagoIO - JavaScript SDK
> TagoIO provides easy connection of electronic devices with external data to drive smarter decisions using contextual analysis. Supports Node.js, Browser, Deno, and Bun environments.

## Help

Official TagoIO SDK for JavaScript. Works across all major JavaScript runtimes and environments.

| what                  | where                    |
|-----------------------|--------------------------|
| TagoIO website        | https://tago.io           |
| SDK documentation     | https://js.sdk.tago.io    |
| General documentation | https://docs.tago.io      |

## Installation

### Node.js & Bun
```bash
npm install @tago-io/sdk
```

### Deno
```bash
deno add @tago-io/sdk
```

## Quick Example
#### Insert Device Data
```javascript
// ESM (recommended)
import { Device } from "@tago-io/sdk";

// CommonJS
// const { Device } = require("@tago-io/sdk");

const myDevice = new Device({ token: "00000000-2ec4-11e6-a77d-991b8f63b767" });

const myData = {
  variable: "temperature",
  location: { lat: 42.2974279, lng: -85.628292 },
  time: new Date(),
  unit: "C",
  value: 63,
};

async function sendMyData() {
  const result = await myDevice.sendData(myData);

  console.log(result);
  // 1 Data Added
}

async function getMyData() {
  const result = await myDevice.getData({ variables: ["temperature"], query: "last_item" });

  console.info("Current Temperature is:", result[0] ? result[0].value : "N/A");
  // Current Temperature is: 63
}

// -> See full documentation at: https://js.sdk.tago.io/
```

## Runtime Compatibility

| Runtime | ESM | CommonJS | Version |
|---------|-----|----------|---------|
| Node.js | ✓   | ✓        | 20+     |
| Browser | ✓   | -        | Modern  |
| Deno    | ✓   | -        | 2.0+    |
| Bun     | ✓   | ✓        | 1.0+    |

## License

TagoIO SDK for JavaScript in the browser and Node.js is released under the [Apache-2.0 License](https://github.com/tago-io/tago-sdk-js/blob/master/LICENSE.md).
