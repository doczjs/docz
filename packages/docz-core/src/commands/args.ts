import * as fs from 'fs-extra'
import envDotProp from 'env-dot-prop'
import humanize from 'humanize-string'
import titleize from 'titleize'
import get from 'lodash/get'

import { Plugin } from '../Plugin'
import { BabelRC } from '../utils/babel-config'
import { setEnv } from '../config/env'
import * as paths from '../config/paths'

const getEnv = (val: string | string[], defaultValue: any = null): any =>
  envDotProp.get(val, defaultValue, { parse: true })

const removeScope = (name: string) => name.replace(/^@.*\//, '')
const getInitialTitle = (pkg: any): string => {
  const name = get(pkg, 'name') || 'MyDoc'
  return titleize(humanize(removeScope(name)))
}

const getInitialDescription = (pkg: any): string =>
  get(pkg, 'description') || 'My awesome app using docz'

export type Env = 'production' | 'development'
export type ThemeConfig = Record<string, any>

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
  websocketPort: number
  websocketHost: string
  native: boolean
  codeSandbox: boolean
  sourcemaps: boolean
  /* template args */
  title: string
  description: string
  theme: string
  /**
   * @deprecated since the new ordering using menu on config file
   * this property will be deleted in the v1.0
   */
  ordering: 'ascending' | 'descending'
  hashRouter: boolean
  wrapper?: string
  indexHtml?: string
  /* slugify separator */
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
  modifyBundlerConfig<C>(config: C, dev: boolean, args: Config): C
  modifyBabelRc(babelrc: BabelRC, args: Config): BabelRC
  onCreateWebpackChain<C>(c: C, dev: boolean, args: Config): void
}

export const args = (env: Env) => (yargs: any) => {
  const pkg = fs.readJsonSync(paths.appPackageJson, { throws: false })

  setEnv(env)
  yargs.positional('base', {
    type: 'string',
    default: getEnv('docz.base', '/'),
  })
  yargs.positional('source', {
    alias: 'src',
    type: 'string',
    default: getEnv('docz.source', './'),
  })
  yargs.positional('files', {
    default: getEnv('docz.files', '**/*.{md,markdown,mdx}'),
  })
  yargs.positional('ignore', {
    type: 'array',
    default: getEnv('docz.ignore', []),
  })
  yargs.positional('public', {
    type: 'string',
    default: getEnv('docz.public', '/public'),
  })
  yargs.positional('dest', {
    alias: 'd',
    type: 'string',
    default: getEnv('docz.dest', '.docz/dist'),
  })
  yargs.positional('editBranch', {
    alias: 'eb',
    type: 'string',
    default: getEnv('docz.edit.branch', 'master'),
  })
  yargs.positional('config', {
    type: 'string',
    default: getEnv('docz.config', ''),
  })
  yargs.positional('title', {
    type: 'string',
    default: getEnv('docz.title', getInitialTitle(pkg)),
  })
  yargs.positional('description', {
    type: 'string',
    default: getEnv('docz.description', getInitialDescription(pkg)),
  })
  yargs.positional('theme', {
    type: 'string',
    default: getEnv('docz.theme', 'docz-theme-default'),
  })
  yargs.positional('typescript', {
    alias: 'ts',
    type: 'boolean',
    default: getEnv('docz.typescript') || false,
  })
  yargs.positional('propsParser', {
    type: 'boolean',
    default: getEnv('docz.props.parser') || true,
  })
  yargs.positional('wrapper', {
    type: 'string',
    default: getEnv('docz.wrapper') || null,
  })
  yargs.positional('indexHtml', {
    type: 'string',
    default: getEnv('docz.index.html') || null,
  })
  yargs.positional('ordering', {
    type: 'string',
    default: getEnv('docz.ordering', 'descending'),
  })
  yargs.positional('debug', {
    type: 'boolean',
    default: getEnv('docz.debug') || false,
  })
  yargs.positional('host', {
    type: 'string',
    default: getEnv('docz.host', '127.0.0.1'),
  })
  yargs.positional('port', {
    alias: 'p',
    type: 'number',
    default: getEnv('docz.port', 3000),
  })
  yargs.positional('websocketHost', {
    type: 'string',
    default: getEnv('docz.websocket.host', '127.0.0.1'),
  })
  yargs.positional('websocketPort', {
    type: 'number',
    default: getEnv('docz.websocket.port', 60505),
  })
  yargs.positional('hahRouter', {
    type: 'boolean',
    default: getEnv('docz.hash.router') || false,
  })
  yargs.positional('native', {
    type: 'boolean',
    default: getEnv('docz.native') || false,
  })
  yargs.positional('codeSandbox', {
    type: 'boolean',
    default: getEnv('docz.codeSandbox') || true,
  })
  yargs.positional('sourcemaps', {
    type: 'boolean',
    default: getEnv('docz.sourcemaps') || true,
  })
  yargs.positional('separator', {
    type: 'string',
    default: getEnv('docz.separator', '-'),
  })
}
