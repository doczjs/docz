/* eslint-disable @typescript-eslint/no-explicit-any */
import chokidar from 'chokidar';
import fastglob from 'fast-glob';
import _ from 'lodash';
import path from 'path';

import { WATCH_IGNORE } from './config';

import type { State } from '~/lib/DataServer';
import type { Params } from '~/lib/State';
import type { Config } from '~/types';
import { docgen, unixPath } from '~/utils/docgen';

export const getPattern = (config: Config) => {
  const { ignore, src: source, docgenConfig } = config;

  if (docgenConfig.searchPatterns) {
    return docgenConfig.searchPatterns;
  }

  const searchPath = docgenConfig.searchPath ? docgenConfig.searchPath : source;
  const root = config.paths.root;
  const srcDir = path.resolve(root, searchPath);
  const src = path.relative(root, srcDir);
  const filesPattern = path.join(src, '**/*.{ts,tsx,js,jsx,mjs}');

  return ignore
    .map((entry) => typeof entry === 'string' && `!**/${entry}`)
    .filter(Boolean)
    .concat([
      unixPath(filesPattern),
      '!**/node_modules',
      '!**/doczrc.js',
    ]) as string[];
};

const removeFilepath = (items: any[], filepath: string) =>
  items.filter((item: any) => item.key !== filepath);

export const initial =
  (config: Config, pattern: string[]) => async (p: Params) => {
    const { filterComponents } = config;
    const cwd = config.paths.root;
    const files = await fastglob(pattern, { cwd, caseSensitiveMatch: false });
    const filtered = filterComponents ? filterComponents(files) : files;
    const metadata = await docgen(filtered, config);
    p.setState('props', metadata);
  };

const change = (p: Params, config: Config) => async (filepath: string) => {
  const prev = _.get(p.getState(), 'props');
  const metadata = await docgen([filepath], config);
  const filtered = metadata.filter((m: any) => m.key === filepath);
  const next = removeFilepath(prev, filepath).concat(filtered);
  p.setState('props', next);
};

const remove = (p: Params) => async (filepath: string) => {
  const prev = _.get(p.getState(), 'props');
  const next = removeFilepath(prev, filepath);
  p.setState('props', next);
};

export const state = (config: Config, dev?: boolean): State => {
  const pattern = getPattern(config);
  const ignored = config.watchIgnore || WATCH_IGNORE;
  const cwd = config.paths.root;
  const watcher = chokidar.watch(pattern, {
    cwd,
    ignored,
    persistent: true,
    useFsEvents: false,
  });

  watcher.setMaxListeners(Infinity);

  return {
    id: 'props',
    start: async (params) => {
      const addInitial = initial(config, pattern);
      await addInitial(params);

      if (dev) {
        watcher.on('change', change(params, config));
        watcher.on('unlink', remove(params));
      }
    },
    close: () => {
      watcher.close();
    },
  };
};
