/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs-extra';
import { normalize } from 'path';
import * as path from 'path';
import * as reactDocgen from 'react-docgen';
import logger from 'signale';

import { actualNameHandler } from './actual-name-handler';
import { resolver as doczResolver } from './docz-docgen-resolver';
import externalProptypesHandler from './externalProptypesHandler';

import { getRootDir } from '~/config/paths';
import type { Config } from '~/types';

export const unixPath = (src: string): string => {
  return normalize(src).replace(/\\/g, '/');
};

const throwError = (err: any) => {
  logger.fatal(`Error parsing static types`);
  logger.error(err);
};

export const jsParser = (files: string[], config: Config) => {
  const resolver = config.docgenConfig.resolver || doczResolver;

  const root = getRootDir(config);
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
