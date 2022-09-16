import { normalize } from 'path';

import { jsParser } from './javascript';
import { tsParser } from './typescript';

import type { Config } from '~/types';

export const unixPath = (src: string): string => {
  return normalize(src).replace(/\\/g, '/');
};

export const docgen = async (files: string[], config: Config) => {
  const { findUp } = await import('find-up');
  const cwd = config.paths.root;
  const tsconfig = await findUp('tsconfig.json', { cwd });
  const tsFiles = files.filter((file) => file.match(/\.(tsx|ts)$/));
  const jsFiles = files.filter((file) => file.match(/\.(js|jsx|mjs)$/));
  return tsParser(tsFiles, config, tsconfig).concat(jsParser(jsFiles, config));
};
