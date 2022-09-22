import chokidar from 'chokidar';
import { findUp } from 'find-up';
import fs from 'fs-extra';
import _ from 'lodash';

import * as paths from '~/config/paths';
import { db } from '~/lib/Database';
import { State } from '~/lib/State';
import type { Config } from '~/types';
import { load, loadFrom, finds } from '~/utils/load-config';
import { getRepoUrl } from '~/utils/repo-info';

export const WATCH_IGNORE = /((\.docz)|(node_modules))/;

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
    rawConfig: _.omit(config, [
      'themeConfig',
      'docgenConfig',
      'menu',
      'plugins',
      'rehypePlugins',
      'remarkPlugins',
      'ignore',
    ]),
  };
};

const createWatcher = (glob: any, config: Config) => {
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

export const state = (config: Config) => {
  const glob = config.configFile || finds('docz');
  const initial = getInitialConfig(config);
  const watcher = createWatcher(glob, config);

  async function update() {
    const pathToConfig = await findUp(finds('docz'), { cwd: paths.root });
    const next = config.configFile
      ? await loadFrom('docz', pathToConfig!, initial, paths.root)
      : await load('docz', initial, paths.root);

    await db.set('config', next);
  }

  return new State('config', {
    watcher,
    onStart: update,
    onAll: update,
  });
};
