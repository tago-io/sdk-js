const fs = require("node:fs");
const packageJson = require("./package.json");

fs.writeFileSync("./src/infrastructure/envParams.ts", `export const version = "${packageJson.version}";\n`, {
  encoding: "utf-8",
});
