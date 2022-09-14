/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs';
import * as path from 'path';
import resolve from 'resolve';

import type { Config } from '~/types';

export const ensureSlash = (filepath: any, needsSlash: boolean) => {
  const hasSlash = filepath.endsWith('/');

  if (hasSlash && !needsSlash) {
    return filepath.substr(filepath, filepath.length - 1);
  }
  if (!hasSlash && needsSlash) {
    return `${filepath}/`;
  }
  return filepath;
};

export const root = fs.realpathSync(process.cwd());
const IS_DOCZ_PROJECT = path.parse(root).base === '.docz';

export const resolveApp = (to: string) => path.resolve(root, IS_DOCZ_PROJECT ? '../' : './', to);

export const checkIsDoczProject = (config: Config) => {
  return path.parse(config.root || root).base === '.docz';
};

export const getRootDir = (config: Config) => {
  const isDoczProject = checkIsDoczProject(config);
  return isDoczProject ? path.resolve(root, '../') : root;
};

export const getThemesDir = (config: Config) => {
  // resolve normalizes the new path and removes trailing slashes
  return path.resolve(path.join(getRootDir(config), config.themesDir));
};

export const templates = path.join(resolve.sync('docz-core'), '../templates');

export const servedPath = (base: string) => ensureSlash(base, true);

export const docz = resolveApp('.docz');
export const cache = path.resolve(docz, '.cache/');
export const app = path.resolve(docz, 'app/');
export const appPackageJson = resolveApp('package.json');
export const appTsConfig = resolveApp('tsconfig.json');

export const getDist = (dest: string) => path.join(root, dest);
export const distPublic = (dest: string) => path.join(dest, 'public/');

export const importsJs = path.resolve(app, 'imports.js');
export const rootJs = path.resolve(app, 'root.jsx');
export const indexJs = path.resolve(app, 'index.jsx');
export const indexHtml = path.resolve(app, 'index.html');
export const db = path.resolve(app, 'db.json');
