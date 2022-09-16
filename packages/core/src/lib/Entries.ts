import glob from 'fast-glob';
// import fs from 'fs-extra';
import _ from 'lodash';
import minimatch from 'minimatch';
import path from 'path';
import logger from 'signale';

import { Entry } from './Entry';

import { Plugin } from '~/lib/Plugin';
import type { Config } from '~/types';
import { parseMdx } from '~/utils/mdast';
import { getRepoEditUrl } from '~/utils/repo-info';

export const matchFilesWithSrc = (config: Config) => (files: string[]) => {
  const { paths, src } = config;
  const rootDir = paths.root;
  const srcDir = path.resolve(rootDir, src);
  const prefix = path.relative(rootDir, srcDir);
  return files.map((file) =>
    file.startsWith(prefix) ? file : path.join(prefix, file)
  );
};

export const getFilesToMatch = (config: Config) => {
  const { files: pattern } = config;
  const arr = Array.isArray(pattern) ? pattern : [pattern];
  const toMatch = matchFilesWithSrc(config);
  return toMatch(arr);
};

export type EntryMap = Record<string, Entry>;

export class Entries {
  public _all: Map<string, Entry>;

  constructor() {
    this._all = new Map();
  }

  public async populate(config: Config) {
    const repoEditUrl = await getRepoEditUrl(config);
    const { paths, ignore, plugins, rehypePlugins, src } = config;
    const fileMatchingPatterns = getFilesToMatch(config);
    const srcHasNodeModules = src.indexOf('node_modules') !== -1;
    // Hack around fast-glob not returning the whole set when many patterns are provided in the array
    let initialFiles: string[] = [];
    for (const filePattern of fileMatchingPatterns) {
      const filePatternHasNodeModules =
        filePattern.indexOf('node_modules') !== -1;
      const shouldIncludeNodeModules =
        srcHasNodeModules || filePatternHasNodeModules;
      const globIgnore = shouldIncludeNodeModules ? [] : ['**/node_modules/**'];

      const filesFromPattern = await glob([filePattern], {
        cwd: paths.root,
        ignore: globIgnore,
        onlyFiles: true,
        unique: true,
        baseNameMatch: false,
        caseSensitiveMatch: false,
      });
      initialFiles = [...initialFiles, ...filesFromPattern];
    }

    const files = initialFiles.filter((value: string) => {
      return !ignore.some((pattern) => {
        if (_.isString(pattern)) return minimatch(value, pattern);
        if (_.isRegExp(pattern)) return pattern.test(value);
        return false;
      });
    });

    const rootDir = paths.root;
    const createEntry = async (file: string) => {
      try {
        const fullpath = path.resolve(rootDir, file);
        const ast = await parseMdx(fullpath, rehypePlugins);
        const entry = new Entry(ast, file, config);
        await entry.populate();

        if (repoEditUrl) entry.setLink(repoEditUrl);

        // reduce modify entry plugin
        const reduce = Plugin.reduceFromPlugins<Entry>(plugins);
        return reduce('modifyEntry', entry, config);
      } catch (err) {
        logger.error(err);
        return null;
      }
    };

    const reduce = Plugin.reduceFromPlugins<string[]>(plugins);
    const modifiedFiles = reduce('modifyFiles', files, config);
    const entries = await Promise.all(
      modifiedFiles.map(createEntry).filter(Boolean)
    );

    await Promise.all(
      entries.map(async (entry) => {
        if (!entry) return;
        this._all.set(entry.filepath, entry);
      })
    );

    return this._all;
  }

  public async getAll() {
    return this._all;
  }

  public remove(filepath: string) {
    this._all.delete(filepath);
  }
}
