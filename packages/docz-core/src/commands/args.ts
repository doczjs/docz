import * as fs from 'fs-extra'
import envDotProp from 'env-dot-prop'
import humanize from 'humanize-string'
import titleize from 'titleize'
import get from 'lodash.get'

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
  files: string
  ignore: string[]
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
  hotPort: number
  hotHost: string
  native: boolean
  codeSandbox: boolean
  /* template args */
  title: string
  description: string
  theme: string
  /**
   * @deprecated since the new ordering using menu on config file
   * this property will be deleted in the v1.0
   */
  ordering: 'ascending' | 'descending'
  wrapper?: string
  indexHtml?: string
}

export interface Config extends Argv {
  paths: Record<string, any>
  hashRouter: boolean
  plugins: Plugin[]
  mdPlugins: any[]
  hastPlugins: any[]
  themeConfig: ThemeConfig
  htmlContext: HtmlContext
  menu: Menu[]
  modifyBundlerConfig<C>(config: C, dev: boolean, args: Config): C
  modifyBabelRc(babelrc: BabelRC, args: Config): BabelRC
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
    type: 'string',
    default: getEnv('docz.files', '**/*.mdx'),
  })
  yargs.positional('ignore', {
    type: 'array',
    default: getEnv('docz.ignore', []),
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
    default: getEnv('docz.typescript', false),
  })
  yargs.positional('propsParser', {
    type: 'boolean',
    default: getEnv('docz.props.parser', true),
  })
  yargs.positional('wrapper', {
    type: 'string',
    default: getEnv('docz.wrapper', null),
  })
  yargs.positional('indexHtml', {
    type: 'string',
    default: getEnv('docz.index.html', null),
  })
  yargs.positional('ordering', {
    type: 'string',
    default: getEnv('docz.ordering', 'descending'),
  })
  yargs.positional('debug', {
    type: 'boolean',
    default: getEnv('docz.debug', false),
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
  yargs.positional('hotHost', {
    type: 'string',
    default: getEnv('docz.hot.host', '127.0.0.1'),
  })
  yargs.positional('hotPort', {
    type: 'number',
    default: getEnv('docz.hot.port', 60757),
  })
  yargs.positional('websocketHost', {
    type: 'string',
    default: getEnv('docz.websocket.host', '127.0.0.1'),
  })
  yargs.positional('websocketPort', {
    type: 'number',
    default: getEnv('docz.websocket.port', 60505),
  })
  yargs.positional('native', {
    type: 'boolean',
    default: getEnv('docz.native', false),
  })
  yargs.positional('codeSandbox', {
    type: 'boolean',
    default: getEnv('docz.codeSandbox', true),
  })
}
