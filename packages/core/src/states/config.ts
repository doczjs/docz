/* eslint-disable @typescript-eslint/no-explicit-any */
import chokidar from 'chokidar';
import fs from 'fs-extra';
import _ from 'lodash';
import path from 'path';

import * as paths from '~/config/paths';
import type { Params } from '~/lib/State';
import { State } from '~/lib/State';
import type { Config, Menu, ThemeConfig } from '~/types';
import { load, loadFrom, finds } from '~/utils/load-config';
import { getRepoUrl } from '~/utils/repo-info';

interface Payload {
  title: string;
  description: string;
  menu: Menu[];
  version: string | null;
  repository: string | null;
  themeConfig: ThemeConfig;
}

const getInitialConfig = (config: Config) => {
  const pkg = fs.readJsonSync(paths.appPackageJson, { throws: false });
  const repoUrl = getRepoUrl();

  return {
    title: config.title,
    description: config.description,
    menu: config.menu,
    version: _.get(pkg, 'version'),
    repository: repoUrl,
    themeConfig: config.themeConfig,
  };
};

const update = async (
  params: Params,
  initial: Payload,
  { configFile }: Config
) => {
  const pathToConfig = path.join(paths.docz, 'doczrc.js');
  const next = configFile
    ? await loadFrom('docz', pathToConfig, initial, process.cwd())
    : await load('docz', initial, process.cwd());

  params.setState('config', next);
};

export const WATCH_IGNORE = /((\.docz)|(node_modules))/;

export const createWatcher = (glob: any, config: Config) => {
  const ignored = config.watchIgnore || WATCH_IGNORE;
  const watcher = chokidar.watch(glob, {
    ignored,
    cwd: config.paths.root,
    persistent: true,
    useFsEvents: false,
  });

  watcher.setMaxListeners(Infinity);
  return watcher;
};

export const state = (config: Config, dev?: boolean) => {
  const glob = config.configFile || finds('docz');
  const initial = getInitialConfig(config);
  const watcher = createWatcher(glob, config);

  return new State('config', {
    start: async (params) => {
      const fn = async () => update(params, initial, config);
      await update(params, initial, config);

      if (dev) {
        watcher.on('add', fn);
        watcher.on('change', fn);
        watcher.on('unlink', fn);
      }
    },
    close: () => {
      watcher.close();
    },
  });
};
