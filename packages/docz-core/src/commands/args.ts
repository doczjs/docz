import * as fs from 'fs-extra'
import humanize from 'humanize-string'
import titleize from 'titleize'

import { Plugin } from '../Plugin'
import { BabelRC } from '../utils/babelrc'
import * as paths from '../config/paths'

const removeScope = (name: string) => name.replace(/^@.*\//, '')
const getInitialTitle = (): string => {
  const pkg = fs.readJsonSync(paths.packageJson, { throws: false })
  const name = pkg && pkg.name ? pkg.name : 'MyDoc'

  return titleize(humanize(removeScope(name)))
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

export const args = (yargs: any) => {
  yargs.positional('base', {
    type: 'string',
    default: '/',
  })
  yargs.positional('source', {
    alias: 'src',
    type: 'string',
    default: './',
  })
  yargs.positional('files', {
    type: 'string',
    default: '**/*.mdx',
  })
  yargs.positional('dest', {
    alias: 'd',
    type: 'string',
    default: '.docz/dist',
  })
  yargs.positional('title', {
    type: 'string',
    default: getInitialTitle(),
  })
  yargs.positional('description', {
    type: 'string',
    default: 'My awesome app using Docz',
  })
  yargs.positional('theme', {
    type: 'string',
    default: 'docz-theme-default',
  })
  yargs.positional('typescript', {
    alias: 'ts',
    type: 'boolean',
    default: false,
  })
  yargs.positional('propsParser', {
    type: 'boolean',
    default: true,
  })
  yargs.positional('wrapper', {
    type: 'string',
  })
  yargs.positional('indexHtml', {
    type: 'string',
  })
  yargs.positional('ordering', {
    type: 'string',
    default: 'descending',
  })
  yargs.positional('debug', {
    type: 'boolean',
    default: process.env.DEBUG || false,
  })
  yargs.positional('protocol', {
    type: 'string',
    default: process.env.HTTPS === 'true' ? 'https' : 'http',
  })
  yargs.positional('host', {
    type: 'string',
    default: process.env.HOST || '127.0.0.1',
  })
  yargs.positional('port', {
    alias: 'p',
    type: 'number',
    default: process.env.PORT || 3000,
  })
  yargs.positional('websocketHost', {
    type: 'string',
    default: process.env.WEBSOCKET_HOST || '127.0.0.1',
  })
  yargs.positional('websocketPort', {
    type: 'number',
    default: process.env.WEBSOCKET_PORT || 8089,
  })
}
