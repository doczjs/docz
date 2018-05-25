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
    const stream = fs.createReadStream(filepath, { encoding: 'utf-8' })

    stream.on('data', chunk => (data += chunk))
    stream.on('end', () => resolve(template(data)))
    stream.on('error', err => reject(err))
  })

const writeGeneratedFiles = async (config: Config): Promise<void> => {
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
    websocketUrl: `ws://${config.websocketHost}:${config.websocketPort}`,
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

const writeImports = async (entries: EntryMap): Promise<void> => {
  const imports = await compiled('imports.tpl.js')
  await touch(paths.importsJs, imports({ entries }))
}

export type EntryMap = Record<string, Entry>

export class Entries {
  public static async writeGenerated(config: Config): Promise<void> {
    mkd(paths.docz)
    await writeGeneratedFiles(config)
  }

  public static async writeImports(entries: EntryMap): Promise<void> {
    await writeImports(entries)
  }

  public all: EntryMap
  public getMap: () => Promise<EntryMap>

  constructor(config: Config) {
    this.all = {}

    this.getMap = async () => {
      this.all = await this.get(config)
      return this.all
    }
  }

  private async get(config: Config): Promise<EntryMap> {
    const { src, files: pattern } = config

    const ignoreGlob = '!node_modules'
    const files: string[] = glob.sync(
      Array.isArray(pattern) ? [...pattern, ignoreGlob] : [pattern, ignoreGlob]
    )

    const isEntry = async (file: string) => Entry.check(file)

    const createEntry = async (file: string) => {
      const ast = await parseMdx(file)
      return new Entry(ast, file, src)
    }

    const filesToReduce = await Promise.all(
      files.filter(isEntry).map(createEntry)
    )

    const reducer = (obj: EntryMap, entry: Entry) => ({
      ...obj,
      [entry.filepath]: entry,
    })

    return filesToReduce.reduce(reducer, {})
  }
}
