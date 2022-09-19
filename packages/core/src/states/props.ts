/* eslint-disable @typescript-eslint/no-explicit-any */
import chokidar from 'chokidar';
import fastglob from 'fast-glob';
import _ from 'lodash';
import path from 'path';

import { WATCH_IGNORE } from './config';

import { db } from '~/lib/Database';
import { State } from '~/lib/State';
import type { Config } from '~/types';
import { docgen, unixPath } from '~/utils/docgen';

const getPattern = (config: Config) => {
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

interface PropItem {
  key: string;
  value: any[];
}

const removeFilepath = (items: PropItem[], filepath: string) => {
  return items.filter((i) => i.key !== filepath);
};

async function setInitialProps(config: Config, pattern: string[]) {
  const { filterComponents } = config;
  const cwd = config.paths.root;
  const files = await fastglob(pattern, { cwd, caseSensitiveMatch: false });
  const filtered = filterComponents ? filterComponents(files) : files;
  const metadata = await docgen(filtered, config);
  await db.set('props', metadata);
}

async function updateProps(config: Config, filepath: string) {
  const prev = db.get('props');
  const metadata = (await docgen([filepath], config)) as any[];
  const filtered = metadata.filter((m: PropItem) => m.key === filepath);
  const old = removeFilepath(prev, filepath);
  const next = old.concat(filtered ? _.last(filtered) : []);
  await db.set('props', _.uniqBy(next, 'key'));
}

async function removeProps(filepath: string) {
  const prev = db.get('props');
  const next = removeFilepath(prev, filepath);
  await db.set('props', next);
}

function createWatcher(config: Config, pattern: string[]) {
  const ignored = config.watchIgnore || WATCH_IGNORE;
  const cwd = config.paths.root;
  const watcher = chokidar.watch(pattern, {
    cwd,
    ignored,
    persistent: true,
    useFsEvents: false,
  });

  watcher.setMaxListeners(Infinity);
  return watcher;
}

export const state = (config: Config) => {
  const pattern = getPattern(config);
  const watcher = createWatcher(config, pattern);

  return new State('props', {
    watcher,
    async onStart() {
      await setInitialProps(config, pattern);
    },
    async onChange(filepath) {
      await updateProps(config, filepath);
    },
    async onAdd(filepath) {
      await updateProps(config, filepath);
    },
    async onMove(filepath) {
      await updateProps(config, filepath);
    },
    async onDelete(filepath) {
      await removeProps(filepath);
    },
  });
};
