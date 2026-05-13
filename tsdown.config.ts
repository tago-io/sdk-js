import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/modules.ts",
  format: ["esm", "cjs"],
  outDir: "./lib",
  clean: true,
  dts: true,
  fixedExtension: false,
  splitting: false,
  sourcemap: true,
  target: "es2020",
  external: ["papaparse", "qs", "eventsource"],
});
