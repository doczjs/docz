import * as fs from 'fs'
import * as mkdir from 'mkdirp'
import * as del from 'del'
import { compile } from 'art-template'

import * as paths from './config/paths'
import { Entry } from './Entry'

const mkd = (dir: string): void => {
  try {
    fs.lstatSync(dir)
  } catch (err) {
    mkdir.sync(dir)
  }
}

const touch = (file: string, content: string) => {
  mkd(paths.PLAYGRODD)
  fs.writeFileSync(file, content, 'utf-8')
}

const compiled = (templateFile: string) =>
  compile(fs.readFileSync(`${paths.TEMPLATES_PATH}/${templateFile}`, 'utf-8'))

export type TConfigFn<C> = (entries: Entry[]) => C
export type TSetupFn<C> = (config: C) => Promise<any>
export type TServerFn<S> = (compiler: any) => S

export interface IConstructorParams<C, S> {
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
  private config: TConfigFn<C>
  private setup: TSetupFn<C>
  private server: TServerFn<S>

  constructor({ id, config, setup, server }: IConstructorParams<C, S>) {
    this.id = id
    this.config = config
    this.setup = setup
    this.server = server
  }

  public async createCompiler(theme: string, entries: Entry[]) {
    const config = this.config(entries)

    await del(paths.PLAYGRODD)
    touch(paths.APP_JS, app({ theme, entries }))
    touch(paths.INDEX_JS, js({}))
    touch(paths.INDEX_HTML, html({}))

    return await this.setup(config)
  }

  public async createServer(compiler: any): Promise<S> {
    return await this.server(compiler)
  }
}

export interface IBundlerFactoryParams {
  port: number
  paths: paths.Paths
}

export interface BundlerFactory {
  create: (args: IBundlerFactoryParams) => Bundler
}
