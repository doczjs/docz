/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs-extra';
import { get } from 'lodash/fp';
import type { Argv as Yargs } from 'yargs';

import { doczRcBaseConfig } from './docz';
import * as paths from './paths';

import * as envDotProp from '~/utils/env';
import { humanizeString, titleize } from '~/utils/string';

const getEnv = (val: string | string[], defaultValue: any = null): any =>
  envDotProp.get(val, defaultValue, { parse: true });

const getInitialTitle = (pkg: any): string => {
  const name = get('name', pkg) || 'MyDoc';
  return titleize(humanizeString(name.replace(/^@.*\//, '')));
};

const getInitialDescription = (pkg: any): string =>
  get('description', pkg) || 'My awesome app using docz';

export const setArgs = (yargs: Yargs) => {
  const pkg = fs.readJsonSync(paths.appPackageJson, { throws: false });
  return yargs
    .option('root', {
      type: 'string',
      default: getEnv('docz.root', paths.root),
    })
    .option('base', {
      type: 'string',
      default: getEnv('docz.base', '/'),
    })
    .option('source', {
      alias: 'src',
      type: 'string',
      default: getEnv('docz.source', doczRcBaseConfig.src),
    })
    .option('files', {
      type: 'string',
      default: getEnv('docz.files', '**/*.{md,markdown,mdx}'),
    })
    .option('ignore', {
      type: 'array',
      default: getEnv('docz.ignore', []),
    })
    .option('public', {
      type: 'string',
      default: getEnv('docz.public', '/public'),
    })
    .option('dest', {
      alias: 'd',
      type: 'string',
      default: getEnv('docz.dest', '.docz/dist'),
    })
    .option('editBranch', {
      alias: 'eb',
      type: 'string',
      default: getEnv('docz.edit.branch', 'master'),
    })
    .option('config', {
      type: 'string',
      default: getEnv('docz.config', ''),
    })
    .option('title', {
      type: 'string',
      default: getEnv('docz.title', getInitialTitle(pkg)),
    })
    .option('description', {
      type: 'string',
      default: getEnv('docz.description', getInitialDescription(pkg)),
    })
    .option('propsParser', {
      type: 'boolean',
      default: getEnv('docz.props.parser', true),
    })
    .option('debug', {
      type: 'boolean',
      default: getEnv('docz.debug', false),
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
    .option('separator', {
      type: 'string',
      default: getEnv('docz.separator', '-'),
    });
};
