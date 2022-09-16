/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import path from 'path';
import type { Arguments } from 'yargs';

import { paths } from '~/config';
import { Plugin } from '~/lib/Plugin';
import type { Config, DoczArgs } from '~/types';
import { load, loadFrom } from '~/utils/load-config';

const toOmit = ['_', '$0', 'version', 'help'];
export const doczRcBaseConfig = {
  themeConfig: {},
  docgenConfig: {},
  menu: [],
  plugins: [],
  rehypePlugins: [],
  remarkPlugins: [],
  src: './',
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

export async function parseConfig(
  argv: Arguments<DoczArgs>,
  custom?: Partial<Config>
) {
  const defaultConfig = getBaseConfig(argv, { port: argv.port, ...custom });
  const config = argv.config
    ? await loadFrom<Config>(
        'docz',
        path.join(paths.docz, 'doczrc.js'),
        defaultConfig,
        paths.root
      )
    : await load<Config>('docz', defaultConfig, paths.root);

  const reduceAsync = Plugin.reduceFromPluginsAsync<Config>(config.plugins);
  return reduceAsync('setConfig', config);
}
