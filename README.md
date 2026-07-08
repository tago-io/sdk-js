<br/>
<p align="center">
  <img src="https://assets.tago.io/tagoio/sdk.png" width="200px" alt="TagoIO"></img>
</p>

# TagoIO JavaScript SDK

Official TagoIO SDK for JavaScript. Works with Node.js, browsers, Deno, and Bun.

---

## Installation

### Node.js and Bun

```bash
npm install @tago-io/sdk
```

### Deno

```bash
deno add @tago-io/sdk
```

## Quick example

Send and read device data:

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
```

## Documentation

- [SDK documentation](https://js.sdk.tago.io)
- [TagoIO docs](https://docs.tago.io)
- [TagoIO website](https://tago.io)
- [Releases](https://github.com/tago-io/sdk-js/releases)

## Requirements

| Runtime | ESM | CommonJS | Version |
|---------|-----|----------|---------|
| Node.js | yes | yes | 20+ |
| Browser | yes | no | Modern |
| Deno | yes | no | 2.0+ |
| Bun | yes | yes | 1.0+ |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Report security issues through [GitHub Security Advisories](https://github.com/tago-io/sdk-js/security/advisories/new), not the public issue tracker.

## License

This repository is licensed under the [Apache License 2.0](LICENSE.md).

### Copyright Notice

TagoIO Inc. retains all rights to the TagoIO name, logo, and branding assets. These materials are not covered under the Apache License. See [LICENSE.md](LICENSE.md#copyright-notice).

---

Built by the TagoIO team. Software licensed under [Apache-2.0](LICENSE.md). TagoIO logos and branding are not covered by Apache-2.0; see [Copyright Notice](LICENSE.md#copyright-notice) in LICENSE.md.
