import * as fs from 'fs'
import * as mkdir from 'mkdirp'
import * as del from 'del'
import { compile } from 'art-template'

import * as paths from './config/paths'
import { Entry } from './Entry'
import { ConfigArgs } from './Server'

const mkd = (dir: string): void => {
  try {
    fs.lstatSync(dir)
  } catch (err) {
    mkdir.sync(dir)
  }
}

const touch = (file: string, content: string) => {
  mkd(paths.playgrodd)
  fs.writeFileSync(file, content, 'utf-8')
}

const compiled = (templateFile: string) =>
  compile(fs.readFileSync(`${paths.templatesPath}/${templateFile}`, 'utf-8'))

export type TConfigFn<C> = (entries: Entry[]) => C
export type TSetupFn<C> = (config: C) => Promise<any>
export type TServerFn<S> = (compiler: any) => S

export interface ICompilerOpts {
  theme: string
}

export interface IConstructorParams<C, S> extends ICompilerOpts {
  id: string
  config: TConfigFn<C>
  setup: TSetupFn<C>
  server: TServerFn<S>
}

const app = compiled('app.tpl.js')
const js = compiled('index.tpl.js')
const html = compiled('index.tpl.html')

export class Bundler<C = any, S = any> {
  readonly id: string
  readonly theme: string
  private config: TConfigFn<C>
  private setup: TSetupFn<C>
  private server: TServerFn<S>

  constructor({ id, config, theme, setup, server }: IConstructorParams<C, S>) {
    this.id = id
    this.theme = theme
    this.config = config
    this.setup = setup
    this.server = server
  }

  public async createCompiler(entries: Entry[]) {
    const { theme } = this
    const config = this.config(entries)

    await del(paths.playgrodd)
    touch(paths.appJs, app({ theme, entries }))
    touch(paths.indexJs, js({}))
    touch(paths.indexHtml, html({}))

    return await this.setup(config)
  }

  public async createServer(compiler: any): Promise<S> {
    return await this.server(compiler)
  }
}

export interface IFactory<C, S> {
  id: string
  config: (args: ConfigArgs) => TConfigFn<C>
  setup: (args: ConfigArgs) => TSetupFn<C>
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
      id: factory.id,
      theme: args.theme,
      config: factory.config(args),
      setup: factory.setup(args),
      server: factory.server(args),
    })
}
