import * as fs from 'fs-extra'
import humanize from 'humanize-string'
import titleize from 'titleize'
import envDotProp from 'env-dot-prop'

import { Plugin } from '../Plugin'
import { BabelRC } from '../utils/babel-config'
import { setEnv } from '../config/env'
import * as paths from '../config/paths'

const getEnv = (val: string | string[], defaultValue: any = null): any =>
  envDotProp.get(val, defaultValue, { parse: true })

const removeScope = (name: string) => name.replace(/^@.*\//, '')
const getInitialTitle = (): string => {
  const pkg = fs.readJsonSync(paths.packageJson, { throws: false })
  const name = pkg && pkg.name ? pkg.name : 'MyDoc'

  return titleize(humanize(removeScope(name)))
}

const getInitialDescription = (): string => {
  const pkg = fs.readJsonSync(paths.packageJson, { throws: false })
  return pkg && pkg.description ? pkg.description : 'My awesome app using docz'
}

export type Env = 'production' | 'development'
export type ThemeConfig = Record<string, any>

export interface Argv {
  /* io args */
  base: string
  src: string
  files: string
  dest: string
  /* bundler args */
  debug: boolean
  typescript: boolean
  propsParser: boolean
  protocol: string
  host: string
  port: number
  websocketPort: number
  websocketHost: string
  hotPort: number
  hotHost: string
  /* template args */
  title: string
  description: string
  theme: string
  ordering: 'ascending' | 'descending'
  wrapper?: string
  indexHtml?: string
}

export interface Config extends Argv {
  hashRouter: boolean
  plugins: Plugin[]
  mdPlugins: any[]
  hastPlugins: any[]
  themeConfig: ThemeConfig
  modifyBundlerConfig<C>(config: C, dev: boolean, args: Config): C
  modifyBabelRc(babelrc: BabelRC, args: Config): BabelRC
}

export const args = (env: Env) => (yargs: any) => {
  setEnv(env)
  yargs.positional('base', {
    type: 'string',
    default: getEnv('docz.base', '/'),
  })
  yargs.positional('source', {
    alias: 'src',
    type: 'string',
    default: getEnv('docz.source', '/'),
  })
  yargs.positional('files', {
    type: 'string',
    default: getEnv('docz.files', '**/*.mdx'),
  })
  yargs.positional('dest', {
    alias: 'd',
    type: 'string',
    default: getEnv('docz.dest', '.docz/dist'),
  })
  yargs.positional('title', {
    type: 'string',
    default: getEnv('docz.title', getInitialTitle()),
  })
  yargs.positional('description', {
    type: 'string',
    default: getEnv('docz.description', getInitialDescription()),
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
  yargs.positional('protocol', {
    type: 'string',
    default: getEnv('docz.https', true) ? 'https' : 'http',
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
    default: getEnv('docz.hot.port', 8089),
  })
  yargs.positional('websocketHost', {
    type: 'string',
    default: getEnv('docz.websocket.host', '127.0.0.1'),
  })
  yargs.positional('websocketPort', {
    type: 'number',
    default: getEnv('docz.websocket.port', 8090),
  })
}
