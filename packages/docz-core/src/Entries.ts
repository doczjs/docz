import * as glob from 'fast-glob'
import * as fs from 'fs'
import * as path from 'path'
import * as mkdir from 'mkdirp'
import { compile } from 'art-template'
import stringify from 'json-stringify-pretty-compact'

import * as paths from './config/paths'
import { propOf } from './utils/helpers'
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
  const content = /js$/.test(path.extname(file)) ? format(raw) : raw

  mkd(paths.docz)
  fs.writeFileSync(file, content, 'utf-8')
}

const compiled = (file: string) =>
  compile(fs.readFileSync(path.join(paths.templates, file), 'utf-8'))

const docs = compiled('docs.tpl.js')
const app = compiled('app.tpl.js')
const js = compiled('index.tpl.js')
const html = compiled('index.tpl.html')

export class Entries {
  public files: string[]
  public config: Config
  public entries: Entry[]

  constructor(config: Config) {
    const { files: pattern } = config

    const ignoreGlob = '!node_modules'
    const files: string[] = glob.sync(
      Array.isArray(pattern) ? [...pattern, ignoreGlob] : [pattern, ignoreGlob]
    )

    this.files = files
    this.config = config
    this.entries = files
      .filter(Entry.check)
      .map(file => new Entry(file, config.src))
  }

  public write(): void {
    const { plugins, title, description, theme } = this.config

    const wrappers = propOf(plugins, 'wrapper')
    const afterRenders = propOf(plugins, 'afterRender')
    const beforeRenders = propOf(plugins, 'beforeRender')
    const imports = this.entries.map(e => e.filepath)

    const rawIndexHtml = html({
      title,
      description,
    })

    const rawDocsJs = docs({
      imports,
    })

    const rawAppJs = app({
      theme,
      wrappers,
    })

    const rawIndexJs = js({
      afterRenders,
      beforeRenders,
    })

    touch(paths.indexHtml, rawIndexHtml)
    touch(paths.appJs, rawAppJs)
    touch(paths.docsJs, rawDocsJs)
    touch(paths.indexJs, rawIndexJs)

    touch(
      paths.dataJson,
      stringify({
        title,
        description,
        theme,
        entries: this.entries,
      })
    )
  }
}
