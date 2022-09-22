import fs from 'fs-extra';
import JoyCon from 'joycon';
import _ from 'lodash';
import os from 'os';
import path from 'path';
import tsNode from 'ts-node';

export const finds = (name: string): string[] => [
  `${name}rc.mjs`,
  `${name}rc.ts`,
  `${name}.config.mjs`,
  `${name}.config.ts`,
];

export async function loadConfigFile(
  files: string[],
  name: string,
  cwd: string
) {
  const configJoycon = new JoyCon();
  let filePath: string = files[0];
  if (files[0].includes('.ts')) {
    const compiler = tsNode.create({ transpileOnly: true });
    const source = await fs.readFile(files[0], 'utf-8');
    const compiled = compiler.compile(source, files[0]);
    const tempDir = os.tmpdir();
    const tempPath = path.join(
      tempDir,
      files[0].replace(path.extname(files[0]), '.mjs')
    );
    filePath = tempPath;
    await fs.outputFile(tempPath, compiled, 'utf-8');
  }
  const filepath = await configJoycon.resolve({
    cwd,
    files: [filePath],
    stopDir: path.parse(cwd).root,
    packageKey: name,
  });
  if (filepath) {
    const mod = await requireESM(filepath);
    return mod?.default || {};
  }
  return {};
}

function requireESM(filepath: string) {
  return import(filepath);
}

export async function load<C = any>(
  name: string,
  defaultConfig: C,
  cwd: string
) {
  const config = await loadConfigFile(finds(name), name, cwd);
  return _.merge(defaultConfig, config ?? {});
}

export async function loadFrom<C = any>(
  name: string,
  filepath: string,
  defaultConfig: C,
  cwd: string
) {
  const config = await loadConfigFile([filepath], name, cwd);
  return _.merge(defaultConfig, config ?? {});
}
