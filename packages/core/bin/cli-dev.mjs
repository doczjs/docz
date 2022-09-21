/* eslint-disable @typescript-eslint/naming-convention */
import chokidar from "chokidar";
import fs from "fs-extra";
import path from "node:path";
import nodemon from "nodemon";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.resolve(__dirname, "../templates");
const watcher = chokidar.watch(`${templatesDir}/*`, { persistent: true });

nodemon({
  script: path.join(__dirname, "../dist/cli.mjs"),
  ext: "js,json,ts,tsx,tpl,mjs",
  args: process.argv.slice(2, Infinity),
  env: {
    NODE_ENV: "development",
  },
  watch: [path.join(__dirname, "../**/*")],
});

function generate() {
  fs.copySync(templatesDir, path.resolve(__dirname, "../dist/templates"));
}
generate();

nodemon
  .on("start", () => {
    watcher.on("change", generate);
    watcher.on("add", generate);
  })
  .on("quit", () => {
    watcher.close();
  });
