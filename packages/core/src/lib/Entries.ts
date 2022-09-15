/* eslint-disable @typescript-eslint/no-explicit-any */
import glob from 'fast-glob';
import fs from 'fs-extra';
import { isRegExp, isString, omit } from 'lodash/fp';
import minimatch from 'minimatch';
import * as path from 'path';
import logger from 'signale';

import type { EntryObj } from './Entry';
import { Entry } from './Entry';

import { Plugin } from '~/lib/Plugin';
import type { Config } from '~/types';
import { parseMdx } from '~/utils/mdast';
import { getRepoEditUrl } from '~/utils/repo-info';
import { outputFileFromTemplate } from '~/utils/template';

const mapToObj = (map: Map<any, any>) =>
  Array.from(map.entries()).reduce(
    (obj, [key, value]) => ({
      ...obj,
      [`${key}`]: omit(['config', 'ast'], value),
    }),
    {}
  );

export const matchFilesWithSrc = (config: Config) => (files: string[]) => {
  const { paths, src } = config;
  const rootDir = paths.getRootDir(config);
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

export type EntryMap = Record<string, EntryObj>;

export class Entries {
  public all: Map<string, EntryObj>;
  public get: () => Promise<EntryMap>;

  constructor(config: Config) {
    this.all = new Map();
    this.get = async () => this.getMap(config);
  }

  private async getMap(config: Config): Promise<EntryMap> {
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
        cwd: paths.getRootDir(config),
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
        if (isString(pattern)) return minimatch(value, pattern);
        if (isRegExp(pattern)) return pattern.test(value);
        return false;
      });
    });

    const rootDir = paths.getRootDir(config);
    const createEntry = async (file: string) => {
      try {
        const fullpath = path.resolve(rootDir, file);
        const ast = await parseMdx(fullpath, rehypePlugins);
        const entry = new Entry(ast, file, config);
        await entry.populate();

        if (repoEditUrl) entry.setLink(repoEditUrl);

        // reduce modify entry plugin
        const reduce = Plugin.reduceFromPlugins<Entry>(plugins);
        const modifiedEntry = reduce('modifyEntry', entry, config);

        const { settings, ...rest } = modifiedEntry;

        return {
          ...settings,
          ...rest,
        };
      } catch (err) {
        logger.error(err);
        return null;
      }
    };

    const reduce = Plugin.reduceFromPlugins<string[]>(plugins);
    const modifiedFiles = reduce('modifyFiles', files, config);
    this.all = new Map();
    const entries = await Promise.all(
      modifiedFiles.map(createEntry).filter(Boolean)
    );

    for (const entry of entries) {
      if (entry) {
        this.all.set(entry?.filepath, entry);
      }
    }

    return mapToObj(this.all);
  }

  static async cleanGenerated(config: Config) {
    const generated = path.resolve(config.paths.docz, `pages/generated`);
    const index = path.resolve(config.paths.docz, `pages/index.jsx`);
    await fs.remove(generated);
    await fs.remove(index);
  }

  static async generatePages(config: Config, entries?: Entries) {
    await Entries.cleanGenerated(config);

    if (!entries) return;
    const generatedPath = path.resolve(config.paths.docz, `pages/generated`);
    await fs.ensureDir(generatedPath);

    for (const entry of entries.all.values()) {
      const route = entry.route === '/' ? '../index' : entry.route;
      const filename = `${route}.jsx`;
      const filepath = path.join(generatedPath, filename);
      const opts = {
        importPath: `~/${entry.filepath}`,
        id: entry.id,
      };

      await fs.ensureFile(filepath);
      await outputFileFromTemplate(
        'generated.tpl.jsx',
        filepath,
        opts,
        {},
        false
      );
    }
  }
}
