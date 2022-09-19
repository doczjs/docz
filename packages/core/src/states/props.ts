/* eslint-disable @typescript-eslint/no-explicit-any */
import chokidar from 'chokidar';
import fastglob from 'fast-glob';
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

const removeFilepath = (items: any[], filepath: string) =>
  items.filter((item: any) => item.key !== filepath);

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
  const metadata = await docgen([filepath], config);
  const filtered = metadata.filter((m: any) => m.key === filepath);
  const next = removeFilepath(prev, filepath).concat(filtered);
  await db.set('props', next);
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
    async onAll(filepath) {
      await updateProps(config, filepath);
    },
    async onDelete(filepath) {
      await removeProps(filepath);
    },
  });
};
