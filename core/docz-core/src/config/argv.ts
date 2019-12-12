import * as fs from 'fs-extra'
import { Argv as Yargs } from 'yargs'
import * as envDotProp from 'env-dot-prop'
import humanize from 'humanize-string'
import titleize from 'titleize'
import { get } from 'lodash/fp'

import { Plugin } from '../lib/Plugin'
import * as paths from '../config/paths'

const getEnv = (val: string | string[], defaultValue: any = null): any =>
  envDotProp.get(val, defaultValue, { parse: true })

const getInitialTitle = (pkg: any): string => {
  const name = get('name', pkg) || 'MyDoc'
  return titleize(humanize(name.replace(/^@.*\//, '')))
}

const getInitialDescription = (pkg: any): string =>
  get('description', pkg) || 'My awesome app using docz'

export type Env = 'production' | 'development'
export type ThemeConfig = Record<string, any>

export interface DocgenConfig {
  handlers?: any[]
  resolver?: (ast: any, recast: any) => any
  propFilter?: (prop: any) => boolean
  searchPath: string
}

export interface Menu {
  name: string
  route?: string
  href?: string
  menu?: Menu[]
}

export interface Argv {
  /* io args */
  root: string
  base: string
  src: string
  files: string | string[]
  ignore: any[]
  watchIgnore: string
  public: string
  dest: string
  editBranch: string
  config: string
  /* bundler args */
  debug: boolean
  typescript: boolean
  propsParser: boolean
  host: string
  port: number
  native: boolean
  notUseSpecifiers: boolean
  openBrowser: boolean
  /* template args */
  title: string
  description: string
  /** slugify separator */
  separator: string
}

export interface Config extends Argv {
  docgenConfig: DocgenConfig
  hastPlugins: any[]
  mdPlugins: any[]
  menu: Menu[]
  paths: paths.Paths
  plugins: Plugin[]
  themeConfig: ThemeConfig
  themesDir: string
  mdxExtensions: string[]
  filterComponents: (files: string[]) => string[]
  customPattern: string[]
}

export const setArgs = (yargs: Yargs) => {
  const pkg = fs.readJsonSync(paths.appPackageJson, { throws: false })

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
      default: getEnv('docz.source', './'),
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
    .option('typescript', {
      alias: 'ts',
      type: 'boolean',
      default: getEnv('docz.typescript', false),
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
    .option('native', {
      type: 'boolean',
      default: getEnv('docz.native', false),
    })
    .option('separator', {
      type: 'string',
      default: getEnv('docz.separator', '-'),
    })
    .option('openBrowser', {
      alias: ['o', 'open'],
      describe: 'auto open browser in dev mode',
      type: 'boolean',
      default: false,
    })
}
