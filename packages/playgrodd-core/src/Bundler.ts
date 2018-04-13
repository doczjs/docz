import * as fs from 'fs'
import * as path from 'path'
import * as mkdir from 'mkdirp'
import * as del from 'del'
import { compile } from 'art-template'
import * as prettier from 'prettier'

import * as paths from './config/paths'
import { Entry } from './Entry'
import { Plugin, IPluginFactory } from './Plugin'
import { ConfigArgs } from './Server'

const mkd = (dir: string): void => {
  try {
    fs.lstatSync(dir)
  } catch (err) {
    mkdir.sync(dir)
  }
}

const format = (raw: string) =>
  prettier.format(raw, {
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
  })

const touch = (file: string, raw: string) => {
  const content = /js/.test(path.extname(file)) ? format(raw) : raw

  mkd(paths.playgrodd)
  fs.writeFileSync(file, content, 'utf-8')
}

const compiled = (templateFile: string) =>
  compile(fs.readFileSync(`${paths.templatesPath}/${templateFile}`, 'utf-8'))

export type TConfigFn<C> = (entries: Entry[]) => C
export type TCompilerFn<C> = (config: C) => Promise<any>
export type TServerFn<S> = (compiler: any) => S

export interface ICompilerOpts {
  args: ConfigArgs
}

export interface IConstructorParams<C, S> extends ICompilerOpts {
  id: string
  config: TConfigFn<C>
  compiler: TCompilerFn<C>
  server: TServerFn<S>
}

const app = compiled('app.tpl.js')
const js = compiled('index.tpl.js')
const html = compiled('index.tpl.html')

export class Bundler<C = any, S = any> {
  readonly id: string
  readonly args: ConfigArgs
  private config: TConfigFn<C>
  private compiler: TCompilerFn<C>
  private server: TServerFn<S>

  constructor({
    args,

    id,
    config,
    compiler,
    server,
  }: IConstructorParams<C, S>) {
    this.args = args
    this.id = id
    this.config = config
    this.compiler = compiler
    this.server = server
  }

  private reduceWithPlugins(dev: boolean) {
    return (config: C, plugin: Plugin) =>
      plugin.bundlerConfig(config, dev) || config
  }

  private mountConfig(entries: Entry[]) {
    const { plugins, env } = this.args

    const dev = env === 'development'
    const initialConfig = this.config(entries)

    return Boolean(plugins) && plugins.length > 0
      ? plugins.reduce(this.reduceWithPlugins(dev), initialConfig)
      : initialConfig
  }

  private routesFromEntries(entries: Entry[]) {
    return (
      entries &&
      entries.length > 0 &&
      entries.reduce((obj, entry) => {
        return Object.assign({}, obj, { [entry.name]: entry.route })
      }, {})
    )
  }

  private propOfPlugins(method: keyof IPluginFactory) {
    const { plugins } = this.args
    return plugins && plugins.map(p => p[method]).filter(m => m)
  }

  private generateFilesByTemplate(entries: Entry[]) {
    const { theme } = this.args

    touch(paths.indexHtml, html({}))

    touch(
      paths.appJs,
      app({
        THEME: theme,
        ENTRIES: entries,
        ROUTES: JSON.stringify(this.routesFromEntries(entries)),
        WRAPPERS: this.propOfPlugins('wrapper'),
      })
    )

    touch(
      paths.indexJs,
      js({
        BEFORE_RENDERS: this.propOfPlugins('beforeRender'),
        AFTER_RENDERS: this.propOfPlugins('afterRender'),
      })
    )
  }

  public async createCompiler(entries: Entry[]) {
    await del(paths.playgrodd)
    this.generateFilesByTemplate(entries)
    return await this.compiler(this.mountConfig(entries))
  }

  public async createServer(compiler: any): Promise<S> {
    return await this.server(compiler)
  }
}

export interface IFactory<C, S> {
  id: string
  config: (args: ConfigArgs) => TConfigFn<C>
  compiler: (args: ConfigArgs) => TCompilerFn<C>
  server: (args: ConfigArgs) => TServerFn<S>
}

export interface IBundlerCreate<C, S> {
  (args: ConfigArgs): Bundler<C, S>
}

export function createBundler<C, S>(
  factory: IFactory<C, S>
): IBundlerCreate<C, S> {
  return (args: ConfigArgs): Bundler<C, S> =>
    new Bundler({
      args,
      id: factory.id,
      config: factory.config(args),
      compiler: factory.compiler(args),
      server: factory.server(args),
    })
}
