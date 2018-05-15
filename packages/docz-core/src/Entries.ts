import * as glob from 'fast-glob'
import * as fs from 'fs'
import * as path from 'path'
import { test, mkdir } from 'shelljs'
import { compile } from 'art-template'

import * as paths from './config/paths'
import { propOf, omit } from './utils/helpers'
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
    stream.on('end', () => resolve(compile(data)))
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
    entries: Object.values(entries),
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
  public static write(config: Config): (entries: EntryMap) => Promise<void> {
    return async (entries: EntryMap) => {
      mkd(paths.docz)
      await writeStructuredFiles(config)
      await writeDataAndImports(entries, config)
    }
  }

  public static rewrite(config: Config): (entries: EntryMap) => Promise<void> {
    return async (entries: EntryMap) => {
      await writeDataAndImports(entries, config)
    }
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

  public remove(file: string): EntryMap {
    return omit([this.entryFilepath(file)], this.all)
  }

  public async update(file: string): Promise<EntryMap> {
    const merge = this.mergeEntriesWithNewEntry(this.all, this.config)
    return (await Entry.check(file)) ? merge(file) : this.all
  }

  public async clean(dir: string): Promise<EntryMap> {
    if (test('-d', dir)) {
      return this.get(this.config)
    }

    const { paths } = this.config
    const src = path.resolve(paths.root, this.config.src)
    let entries = this.all

    for (const file of Object.keys(this.all)) {
      const filepath = path.join(src, file)
      if (!test('-f', filepath)) {
        entries = this.remove(filepath)
      }
    }

    return entries
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

  private entryFilepath(file: string): string {
    const srcPath = path.resolve(paths.root, this.config.src)
    return path.relative(srcPath, file)
  }

  private mergeEntriesWithNewEntry(
    entries: EntryMap,
    config: Config
  ): (file: string) => Promise<EntryMap> {
    return async (file: string) => {
      const ast = await parseMdx(file)
      const entry = new Entry(ast, file, this.config.src)

      return {
        ...entries,
        [entry.filepath]: entry,
      }
    }
  }
}
