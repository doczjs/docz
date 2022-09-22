/* eslint-disable @typescript-eslint/naming-convention */
import path from "node:path";
import nodemon from "nodemon";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

nodemon({
  script: path.join(__dirname, "../dist/cli.mjs"),
  ext: "js,json,ts,tsx,tpl,mjs",
  args: process.argv.slice(2, Infinity),
  env: {
    NODE_ENV: "development",
  },
  watch: [
    path.join(__dirname, "../../core/**/*"),
    path.join(__dirname, "../../docz-rehype/**/*"),
  ],
});
