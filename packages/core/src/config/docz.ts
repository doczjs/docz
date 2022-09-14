/* eslint-disable @typescript-eslint/no-explicit-any */
import { load, loadFrom } from '@docz/load-config';
import detectPort from 'detect-port';
import { omit, merge } from 'lodash/fp';
import * as path from 'path';
import type { Arguments } from 'yargs';

import * as paths from './paths';

import type { Config, Argv } from '~/types';
// import { Plugin } from '../lib/Plugin';

const toOmit = ['_', '$0', 'version', 'help'];
export const doczRcBaseConfig: Partial<Config> = {
  themeConfig: {},
  src: './',
  themesDir: 'src',
  mdxExtensions: ['.md', '.mdx'],
  docgenConfig: {},
  menu: [],
  plugins: [],
  rehypePlugins: [],
  remarkPlugins: [],
  ignore: [/readme.md/i, /changelog.md/i, /code_of_conduct.md/i, /contributing.md/i, /license.md/i],
  filterComponents: (files: string[]) =>
    files.filter((filepath) => {
      const isTestFile = /\.(test|spec)\.(js|jsx|ts|tsx)$/.test(filepath);
      if (isTestFile) {
        return false;
      }
      const startsWithCapitalLetter = /\/([A-Z]\w*)\.(js|jsx|ts|tsx)$/.test(filepath);
      const isCalledIndex = /\/index\.(js|jsx|ts|tsx)$/.test(filepath);
      const hasJsxOrTsxExtension = /.(jsx|tsx)$/.test(filepath);
      return startsWithCapitalLetter || isCalledIndex || hasJsxOrTsxExtension;
    }),
};

export const getBaseConfig = (argv: Arguments<Argv>, custom?: Partial<Config>): Config => {
  const initial = omit<Arguments<Argv>, any>(toOmit, argv);
  const base = { ...doczRcBaseConfig, ...initial, paths };
  return merge(base, custom) as Config;
};

export const parseConfig = async (
  argv: Arguments<Argv>,
  custom?: Partial<Config>
): Promise<Config> => {
  const port = await detectPort(argv.port);
  const defaultConfig = getBaseConfig(argv, { port, ...custom });

  const config = argv.config
    ? await loadFrom<Config>('docz', path.join(paths.docz, 'doczrc.js'), defaultConfig, paths.root)
    : await load<Config>('docz', defaultConfig, paths.root);

  // TODO: activate plugins here
  // const reduceAsync = Plugin.reduceFromPluginsAsync<Config>(config.plugins);
  // return reduceAsync('setConfig', config);
  return merge(config, defaultConfig);
};
