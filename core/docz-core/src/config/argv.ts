import * as fs from 'fs-extra'
import { Argv as Yargs } from 'yargs'
import * as envDotProp from 'env-dot-prop'
import humanize from 'humanize-string'
import titleize from 'titleize'
import { get } from 'lodash/fp'

import { Plugin } from '../lib/Plugin'
import { BabelRC } from '../config/babel'
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
}

export interface Menu {
  name: string
  route?: string
  href?: string
  menu?: Menu[]
}

export interface HtmlContext {
  lang: string
  favicon?: string
  head?: {
    meta: any[]
    links: any[]
    raw: string
    scripts: any[]
  }
  body?: {
    raw: string
    scripts: any[]
  }
}

export interface Argv {
  /* io args */
  base: string
  src: string
  files: string | string[]
  ignore: string[]
  watchIgnore: string
  public: string
  dest: string
  editBranch: string
  config: string
  /* bundler args */
  debug: boolean
  clearConsole: boolean
  typescript: boolean
  propsParser: boolean
  host: string
  proxy: string
  disableHostCheck: string
  port: number
  websocketPort: number
  websocketHost: string
  native: boolean
  codeSandbox: boolean
  sourcemaps: boolean
  /* template args */
  title: string
  description: string
  theme: string
  wrapper?: string
  indexHtml?: string
  /** slugify separator */
  separator: string
}

export interface Config extends Argv {
  paths: Record<string, any>
  plugins: Plugin[]
  mdPlugins: any[]
  hastPlugins: any[]
  menu: Menu[]
  htmlContext: HtmlContext
  themeConfig: ThemeConfig
  docgenConfig: DocgenConfig
  filterComponents: (files: string[]) => string[]
  modifyBundlerConfig<C>(config: C, dev: boolean, args: Config): C
  modifyBabelRc(babelrc: BabelRC, args: Config): BabelRC
  onCreateWebpackChain<C>(c: C, dev: boolean, args: Config): void
}

export const setArgs = (yargs: Yargs) => {
  const pkg = fs.readJsonSync(paths.appPackageJson, { throws: false })

  return yargs
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
    .option('theme', {
      type: 'string',
      default: getEnv('docz.theme', 'docz-theme-default'),
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
    .option('wrapper', {
      type: 'string',
      default: getEnv('docz.wrapper', null),
    })
    .option('indexHtml', {
      type: 'string',
      default: getEnv('docz.index.html', null),
    })
    .option('debug', {
      type: 'boolean',
      default: getEnv('docz.debug', false),
    })
    .option('clearConsole', {
      type: 'boolean',
      default: getEnv('docz.clear.console', true),
    })
    .option('host', {
      type: 'string',
      default: getEnv('docz.host', '127.0.0.1'),
    })
    .option('port', {
      alias: 'p',
      type: 'number',
      default: getEnv('docz.port', 3000),
    })
    .option('websocketHost', {
      type: 'string',
      default: getEnv('docz.websocket.host', '127.0.0.1'),
    })
    .option('websocketPort', {
      type: 'number',
      default: getEnv('docz.websocket.port', 60505),
    })
    .option('native', {
      type: 'boolean',
      default: getEnv('docz.native', false),
    })
    .option('codeSandbox', {
      type: 'boolean',
      default: getEnv('docz.codeSandbox', true),
    })
    .option('sourcemaps', {
      type: 'boolean',
      default: getEnv('docz.sourcemaps', true),
    })
    .option('separator', {
      type: 'string',
      default: getEnv('docz.separator', '-'),
    })
    .option('open', {
      alias: 'o',
      describe: 'auto open browser in dev mode',
      type: 'boolean',
      default: false,
    })
}
