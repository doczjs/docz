import fs from 'fs-extra';
import path from 'path';
import reactDocgen from 'react-docgen';
import logger from 'signale';

import type { Config } from '../../types';

import { actualNameHandler } from './actual-name-handler';
import { resolver as doczResolver } from './docz-docgen-resolver';
import externalProptypesHandler from './externalProptypesHandler';

export const unixPath = (src: string): string => {
  return path.normalize(src).replace(/\\/g, '/');
};

const throwError = (err: any) => {
  logger.fatal(`Error parsing static types`);
  logger.error(err);
};

export const jsParser = (files: string[], config: Config) => {
  const resolver = config.docgenConfig?.resolver ?? doczResolver;
  const root = config.paths.root;

  const parseFilepathProps = (filepath: string) => {
    const fullpath = path.resolve(root, filepath);
    const handlers = reactDocgen.defaultHandlers.concat([
      externalProptypesHandler(filepath),
      actualNameHandler,
    ]);

    try {
      const code = fs.readFileSync(fullpath, { encoding: 'utf-8' });
      const props = reactDocgen.parse(code, resolver, handlers);
      return { key: unixPath(filepath), value: props };
    } catch (err) {
      if (config.debug) throwError(err);
      return null;
    }
  };

  return files.map(parseFilepathProps).filter(Boolean);
};
