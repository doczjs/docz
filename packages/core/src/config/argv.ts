/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs-extra';
import _ from 'lodash';
import type { Argv as Yargs } from 'yargs';

import { paths } from '~/config';
import type { DoczArgs } from '~/types';
import * as envDotProp from '~/utils/env';
import { humanizeString, titleize } from '~/utils/string';

const getEnv = (val: string | string[], defaultValue: any = null): any =>
  envDotProp.get(val, defaultValue, { parse: true });

const getInitialTitle = (pkg: any): string => {
  const name = _.get(pkg, 'name') || 'MyDoc';
  return titleize(humanizeString(name.replace(/^@.*\//, '')));
};

const getInitialDescription = (pkg: any): string =>
  _.get(pkg, 'description') || 'My awesome app using docz';

export const setArgs = (yargs: Yargs<DoczArgs>) => {
  const pkg = fs.readJsonSync(paths.appPackageJson, { throws: false });
  return yargs
    .option('root', {
      type: 'string',
      default: getEnv('docz.root', paths.root),
    })
    .option('files', {
      type: 'string',
      default: getEnv('docz.files', '**/*.{md,markdown,mdx}'),
    })
    .option('source', {
      alias: 'src',
      type: 'string',
      default: getEnv('docz.source', paths.appSrc),
    })
    .option('ignore', {
      type: 'array',
      default: getEnv('docz.ignore', []),
    })
    .option('distDir', {
      alias: 'd',
      type: 'string',
      default: getEnv('docz.distDir', paths.distDir),
    })
    .option('publicDir', {
      type: 'string',
      default: getEnv('docz.publicDir', paths.appPublic),
    })
    .option('editBranch', {
      alias: 'eb',
      type: 'string',
      default: getEnv('docz.editBranch', 'master'),
    })
    .option('configFile', {
      type: 'string',
      default: getEnv('docz.configFile', null),
    })
    .option('debug', {
      type: 'boolean',
      default: getEnv('docz.debug', false),
    })
    .option('propsParser', {
      type: 'boolean',
      default: getEnv('docz.propsParser', false),
    })
    .option('host', {
      type: 'string',
      default: getEnv('docz.host', 'localhost'),
    })
    .option('port', {
      alias: 'p',
      type: 'number',
      default: getEnv('docz.port', 3000),
    })
    .option('base', {
      type: 'string',
      default: getEnv('docz.base', '/'),
    })
    .option('site', {
      type: 'string',
      default: getEnv('docz.site', 'https://mysite.com'),
    })
    .option('title', {
      type: 'string',
      default: getEnv('docz.title', getInitialTitle(pkg)),
    })
    .option('description', {
      type: 'string',
      default: getEnv('docz.description', getInitialDescription(pkg)),
    });
};
