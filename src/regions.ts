interface RegionsObj {
  [region: string]: {
    api: string;
    realtime: string;
  };
}

const regions = {
  "us-east": {
    api: "https://api.tago.io",
    realtime: "wss://realtime.tago.io",
  },
  "custom-env": {
    api: process.env.TAGOIO_API,
    realtime: process.env.TAGOIO_REALTIME,
  },
};

type Regions = keyof typeof regions;

export default regions as RegionsObj;
export { Regions };
