## Installation

```bash
$ npm install @tago-io/sdk --save
```

___

## Quick Example
#### Insert Device Data
``` javascript
const { Device } = require("@tago-io/sdk");

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

// -> See full documentation at: http://sdk.js.tago.io/
```

___

## License

TagoIO SDK for JavaScript in the browser and Node.js is released under the [Apache-2.0 License](https://github.com/tago-io/tago-sdk-js/blob/master/LICENSE.md).
