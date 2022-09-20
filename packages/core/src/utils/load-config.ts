import JoyCon from 'joycon';
import _ from 'lodash';
import path from 'path';

export const finds = (name: string): string[] => [
  `${name}rc.mjs`,
  `${name}.config.mjs`,
];

export async function loadConfigFile(
  files: string[],
  name: string,
  cwd: string
) {
  const configJoycon = new JoyCon();
  const filepath = await configJoycon.resolve({
    cwd,
    files,
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
