const fs = require("fs");
const packageJson = require("./package.json");

fs.writeFileSync("./src/infrastructure/envParams.json", `{"version": "${packageJson.version}"}`, {
  encoding: "utf-8",
});
