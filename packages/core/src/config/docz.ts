import { findUp } from 'find-up';
import _ from 'lodash';
import type { Arguments } from 'yargs';

import { paths } from '~/config';
import { Plugin } from '~/lib/Plugin';
import type { Config, DoczArgs } from '~/types';
import { finds, load, loadFrom } from '~/utils/load-config';

const toOmit = ['_', '$0', 'version', 'help'];
export const doczRcBaseConfig = {
  themeConfig: {},
  docgenConfig: {},
  menu: [],
  plugins: [],
  rehypePlugins: [],
  remarkPlugins: [],
  ignore: [
    /readme.md/i,
    /changelog.md/i,
    /code_of_conduct.md/i,
    /contributing.md/i,
    /license.md/i,
  ],
  filterComponents: (files: string[]) =>
    files.filter((filepath) => {
      const isTestFile = /\.(test|spec)\.(js|jsx|ts|tsx)$/.test(filepath);
      if (isTestFile) {
        return false;
      }
      const startsWithCapitalLetter = /\/([A-Z]\w*)\.(js|jsx|ts|tsx)$/.test(
        filepath
      );
      const isCalledIndex = /\/index\.(js|jsx|ts|tsx)$/.test(filepath);
      const hasJsxOrTsxExtension = /.(jsx|tsx)$/.test(filepath);
      return startsWithCapitalLetter || isCalledIndex || hasJsxOrTsxExtension;
    }),
};

export const getBaseConfig = (
  argv: Arguments<DoczArgs>,
  custom?: Partial<Config>
) => {
  const initial = _.omit<Arguments<DoczArgs>, any>(argv, toOmit);
  const base = { ...doczRcBaseConfig, ...initial, paths };
  return _.merge(base, custom) as Config;
};

function omitAbbr(config: any) {
  return _.omit(config, [
    'public-dir',
    'd',
    'dist-dir',
    'eb',
    'edit-branch',
    'config-file',
    'props-parser',
    'layout-file',
    'p',
  ]);
}

export async function parseConfig(
  argv: Arguments<DoczArgs>,
  custom?: Partial<Config>
) {
  const defaultConfig = getBaseConfig(argv, custom);
  const configPath =
    argv.configFile || (await findUp(finds('docz'), { cwd: paths.root }));

  const config = configPath
    ? await loadFrom<Config>('docz', configPath, defaultConfig, paths.root)
    : await load<Config>('docz', defaultConfig, paths.root);

  const reduceAsync = Plugin.reduceFromPluginsAsync<Config>(config.plugins);
  return reduceAsync('setConfig', omitAbbr(config) as Config);
}
