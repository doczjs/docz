/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from 'dotenv';
import path from 'path';

import { root, resolveApp } from './paths';

import * as envDotProp from '~/utils/env';

const populateNodePath = () => {
  // We support resolving modules according to `NODE_PATH`.
  // It works similar to `NODE_PATH` in Node itself:
  // https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders
  // Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
  // Otherwise, we risk importing Node.js core modules into an app instead of Webpack shims.
  // https://github.com/facebook/create-react-app/issues/1023#issuecomment-265344421
  // We also resolve them to make sure all tools using them work consistently.
  envDotProp.set(
    'node.path',
    envDotProp
      .get('node.path', '')
      .split(path.delimiter)
      .filter((folder: any) => folder && !path.isAbsolute(folder))
      .map((folder: any) => path.resolve(root, folder))
      .join(path.delimiter)
  );
};

const configDotEnv = () => {
  const NODE_ENV = envDotProp.get('node.env');
  const dotenv = resolveApp('.env');

  const dotenvFiles = [
    `${dotenv}.${NODE_ENV}.local`,
    `${dotenv}.${NODE_ENV}`,
    // Don't include `.env.local` for `test` environment
    // since normally you expect tests to produce the same
    // results for everyone
    NODE_ENV !== 'test' && `${dotenv}.local`,
    dotenv,
  ];

  // Load environment variables from .env* files. Suppress warnings using silent
  // if this file is missing. dotenv will never modify any environment variables
  // that have already been set.  Variable expansion is supported in .env files.
  // https://github.com/motdotla/dotenv
  dotenvFiles.filter(Boolean).forEach((dotenvFile) => {
    dotenvFile && config({ path: dotenvFile });
  });
};

export const setEnv = (env: string) => {
  envDotProp.set('babel.env', env);
  envDotProp.set('node.env', env);

  configDotEnv();
  populateNodePath();
};

export interface RT {
  [key: string]: any;
}

export const getClientEnvironment = (publicUrl: string) => {
  const APP_TEST = /^(REACT_APP_)|(ANGULAR_APP_)|(VUE_APP_)|(DOCZ_)/i;
  const raw: RT = Object.keys(process.env)
    .filter((key) => APP_TEST.test(key))
    .reduce(
      (env: RT, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode. Most
        // importantly, it switches React into the correct mode.
        NODE_ENV: envDotProp.get('node.env') || 'development',
        // Useful for resolving the correct path to static assets in `public`. For
        // example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />. This should
        // only be used as an escape hatch. Normally you would put images into the `src`
        // and `import` them in code to get their
        PUBLIC_URL: publicUrl,
      }
    );

  const stringified = {
    'process.env': Object.keys(raw).reduce((env: RT, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
};
