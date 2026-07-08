<br/>
<p align="center">
  <img src="https://assets.tago.io/tagoio/sdk.png" width="200px" alt="TagoIO"></img>
</p>

# TagoIO JavaScript SDK

Official TagoIO SDK for JavaScript. Works with Node.js, browsers, Deno, and Bun.

---

## Installation

```bash
npm install @tago-io/sdk
```

## Quick example

```javascript
import { Device } from "@tago-io/sdk";

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
}

async function getMyData() {
  const result = await myDevice.getData({ variables: ["temperature"], query: "last_item" });
  console.info("Current Temperature is:", result[0] ? result[0].value : "N/A");
}
```

Full documentation: https://js.sdk.tago.io

## License

This repository is licensed under the [Apache License 2.0](LICENSE.md).

---

Built by the TagoIO team. Software licensed under [Apache-2.0](LICENSE.md). TagoIO logos and branding are not covered by Apache-2.0; see [Copyright Notice](LICENSE.md#copyright-notice) in LICENSE.md.
