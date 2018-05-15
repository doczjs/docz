import * as glob from 'fast-glob'
import * as fs from 'fs'
import * as path from 'path'
import { test, mkdir } from 'shelljs'
import template from 'lodash.template'

import * as paths from './config/paths'
import { propOf } from './utils/helpers'
import { format } from './utils/format'

import { Entry, parseMdx } from './Entry'
import { Config } from './commands/args'

const mkd = (dir: string): void => {
  !test('-d', dir) && mkdir('-p', dir)
}

const touch = (file: string, raw: string) =>
  new Promise(async (resolve, reject) => {
    const content = /jsx?$/.test(path.extname(file)) ? await format(raw) : raw
    const stream = fs.createWriteStream(file)

    stream.write(content, 'utf-8')
    stream.on('finish', () => resolve())
    stream.on('error', err => reject(err))
    stream.end()
  })

const compiled = (file: string) =>
  new Promise<(args: any) => string>((resolve, reject) => {
    let data = ''
    const filepath = path.join(paths.templates, file)
    const stream = fs.createReadStream(filepath, {
      encoding: 'utf-8',
    })

    stream.on('data', chunk => (data += chunk))
    stream.on('end', () => resolve(template(data)))
    stream.on('error', err => reject(err))
  })

const stringify = (obj: any) => JSON.stringify(obj, null, 2)

const writeStructuredFiles = async (config: Config): Promise<void> => {
  const { plugins, title, description, theme } = config

  const wrappers = propOf(plugins, 'wrapper')
  const afterRenders = propOf(plugins, 'afterRender')
  const beforeRenders = propOf(plugins, 'beforeRender')

  const app = await compiled('app.tpl.js')
  const js = await compiled('index.tpl.js')
  const html = await compiled('index.tpl.html')

  const rawAppJs = app({
    theme,
    wrappers,
  })

  const rawIndexJs = js({
    afterRenders,
    beforeRenders,
  })

  const rawIndexHtml = html({
    title,
    description,
  })

  await touch(paths.appJs, rawAppJs)
  await touch(paths.indexJs, rawIndexJs)
  await touch(paths.indexHtml, rawIndexHtml)
}

const writeDataAndImports = async (
  entries: EntryMap,
  config: Config
): Promise<void> => {
  const { title, description, theme } = config
  const imports = await compiled('imports.tpl.js')

  const rawImportsJs = imports({
    entries,
  })

  const rawData = stringify({
    title,
    description,
    theme,
    entries,
  })

  await touch(paths.importsJs, rawImportsJs)
  await touch(paths.dataJson, rawData)
}

export type EntryMap = Record<string, Entry>

export class Entries {
  public static async write(config: Config, entries: EntryMap): Promise<void> {
    mkd(paths.docz)
    await writeStructuredFiles(config)
    await writeDataAndImports(entries, config)
  }

  public static async rewrite(config: Config): Promise<void> {
    const entries = new Entries(config)
    const map = await entries.getMap()

    await writeDataAndImports(map, config)
  }

  public config: Config
  public all: EntryMap
  public getMap: () => Promise<EntryMap>

  constructor(config: Config) {
    this.config = config
    this.all = {}

    this.getMap = async () => {
      this.all = await this.get(this.config)
      return this.all
    }
  }

  private async get(config: Config): Promise<EntryMap> {
    const { files: pattern } = config

    const ignoreGlob = '!node_modules'
    const files: string[] = glob.sync(
      Array.isArray(pattern) ? [...pattern, ignoreGlob] : [pattern, ignoreGlob]
    )

    const filesToReduce = await Promise.all(
      files.filter(async file => Entry.check(file)).map(async file => {
        const ast = await parseMdx(file)
        return new Entry(ast, file, this.config.src)
      })
    )

    const reducer = (obj: EntryMap, entry: Entry) => ({
      ...obj,
      [entry.filepath]: entry,
    })

    return filesToReduce.reduce(reducer, {})
  }
}
