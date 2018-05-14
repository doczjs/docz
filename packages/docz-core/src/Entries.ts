import * as glob from 'fast-glob'
import * as fs from 'fs'
import * as path from 'path'
import { test, mkdir } from 'shelljs'
import { compile } from 'art-template'

import * as paths from './config/paths'
import { propOf, omit } from './utils/helpers'
import { format } from './utils/format'

import { Entry } from './Entry'
import { Config } from './commands/args'

const mkd = (dir: string): void => {
  !test('-d', dir) && mkdir('-p', dir)
}

const touch = (file: string, raw: string) => {
  const content = /jsx?$/.test(path.extname(file)) ? format(raw) : raw

  mkd(paths.docz)
  fs.writeFileSync(file, content, 'utf-8')
}

const compiled = (file: string) =>
  compile(fs.readFileSync(path.join(paths.templates, file), 'utf-8'))

const stringify = (obj: any) => JSON.stringify(obj, null, 2)

export type EntryMap = Record<string, Entry>

export class Entries {
  public config: Config
  public entries: EntryMap

  constructor(config: Config) {
    this.config = config
    this.entries = this.getEntries(config)
  }

  public write(): void {
    this.writeStructuredFiles()
    this.writeDataAndImports()
  }

  public rewrite(): void {
    this.writeDataAndImports()
  }

  public remove(file: string): void {
    this.entries = omit([this.entryFilepath(file)], this.entries)
  }

  public update(file: string): void {
    if (Entry.check(file)) {
      this.entries = this.mergeEntriesWithNewEntry(this.entries, file)
    }
  }

  public clean(dir: string): void {
    if (test('-d', dir)) {
      this.entries = this.getEntries(this.config)
      return
    }

    const { paths } = this.config
    const src = path.resolve(paths.root, this.config.src)

    for (const file of Object.keys(this.entries)) {
      const filepath = path.join(src, file)
      if (!test('-f', filepath)) this.remove(filepath)
    }
  }

  private entryFilepath(file: string): string {
    const srcPath = path.resolve(paths.root, this.config.src)
    return path.relative(srcPath, file)
  }

  private getEntries(config: Config): EntryMap {
    const { files: pattern } = config

    const ignoreGlob = '!node_modules'
    const files: string[] = glob.sync(
      Array.isArray(pattern) ? [...pattern, ignoreGlob] : [pattern, ignoreGlob]
    )

    return files
      .filter(Entry.check)
      .reduce((obj, file) => this.mergeEntriesWithNewEntry(obj, file), {})
  }

  private mergeEntriesWithNewEntry(obj: EntryMap, file: string): EntryMap {
    const entry = new Entry(file, this.config.src)

    return {
      ...obj,
      [entry.filepath]: entry,
    }
  }

  private writeStructuredFiles(): void {
    const { plugins, title, description, theme } = this.config

    const wrappers = propOf(plugins, 'wrapper')
    const afterRenders = propOf(plugins, 'afterRender')
    const beforeRenders = propOf(plugins, 'beforeRender')

    const app = compiled('app.tpl.js')
    const js = compiled('index.tpl.js')
    const html = compiled('index.tpl.html')

    const rawAppJs = app({ theme, wrappers })
    const rawIndexJs = js({ afterRenders, beforeRenders })
    const rawIndexHtml = html({ title, description })

    touch(paths.appJs, rawAppJs)
    touch(paths.indexJs, rawIndexJs)
    touch(paths.indexHtml, rawIndexHtml)
  }

  private writeDataAndImports(): void {
    const { title, description, theme } = this.config
    const imports = compiled('imports.tpl.js')

    const rawImportsJs = imports({
      entries: Object.values(this.entries),
    })

    const rawData = stringify({
      title,
      description,
      theme,
      entries: this.entries,
    })

    touch(paths.importsJs, rawImportsJs)
    touch(paths.dataJson, rawData)
  }
}
