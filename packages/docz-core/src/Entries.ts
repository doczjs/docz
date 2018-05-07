import * as glob from 'fast-glob'
import * as fs from 'fs'
import * as path from 'path'
import * as mkdir from 'mkdirp'
import { compile } from 'art-template'
import stringify from 'json-stringify-pretty-compact'

import * as paths from './config/paths'
import { propOf, omit } from './utils/helpers'
import { format } from './utils/format'

import { Entry } from './Entry'
import { Config } from './commands/args'

const mkd = (dir: string): void => {
  try {
    fs.lstatSync(dir)
  } catch (err) {
    mkdir.sync(dir)
  }
}

const touch = (file: string, raw: string) => {
  const content = /jsx?$/.test(path.extname(file)) ? format(raw) : raw

  mkd(paths.docz)
  fs.writeFileSync(file, content, 'utf-8')
}

const compiled = (file: string) =>
  compile(fs.readFileSync(path.join(paths.templates, file), 'utf-8'))

const imports = compiled('imports.tpl.js')
const app = compiled('app.tpl.js')
const js = compiled('index.tpl.js')
const html = compiled('index.tpl.html')

export type EntryMap = Record<string, Entry>

export class Entries {
  public files: string[]
  public config: Config
  public entries: EntryMap

  constructor(config: Config) {
    const { files: pattern } = config

    const ignoreGlob = '!node_modules'
    const files: string[] = glob.sync(
      Array.isArray(pattern) ? [...pattern, ignoreGlob] : [pattern, ignoreGlob]
    )

    this.files = files
    this.config = config
    this.entries = this.getEntries(files)
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
    const filepath = this.entryFilepath(file)

    this.entries = {
      ...this.entries,
      [filepath]: new Entry(file, this.config.src),
    }
  }

  private entryFilepath(file: string): string {
    const srcPath = path.resolve(paths.root, this.config.src)
    return path.relative(srcPath, file)
  }

  private getEntries(files: string[]): EntryMap {
    return files.filter(Entry.check).reduce((obj, file) => {
      const entry = new Entry(file, this.config.src)
      return { ...obj, [entry.filepath]: entry }
    }, {})
  }

  private writeStructuredFiles(): void {
    const { plugins, title, description, theme } = this.config

    const wrappers = propOf(plugins, 'wrapper')
    const afterRenders = propOf(plugins, 'afterRender')
    const beforeRenders = propOf(plugins, 'beforeRender')

    const rawAppJs = app({ theme, wrappers })
    const rawIndexJs = js({ afterRenders, beforeRenders })
    const rawIndexHtml = html({ title, description })

    touch(paths.appJs, rawAppJs)
    touch(paths.indexJs, rawIndexJs)
    touch(paths.indexHtml, rawIndexHtml)
  }

  private writeDataAndImports(): void {
    const { title, description, theme } = this.config

    const rawImportsJs = imports({ entries: Object.values(this.entries) })
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
