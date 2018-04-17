import * as glob from 'fast-glob'
import * as fs from 'fs'
import * as path from 'path'
import * as mkdir from 'mkdirp'
import * as prettier from 'prettier'
import { compile } from 'art-template'

import * as paths from './config/paths'
import { propOf } from './utils/helpers'

import { Entry } from './Entry'
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

  mkd(paths.docz)
  fs.writeFileSync(file, content, 'utf-8')
}

const compiled = (file: string) =>
  compile(fs.readFileSync(path.join(paths.templates, file), 'utf-8'))

const app = compiled('app.tpl.js')
const js = compiled('index.tpl.js')
const html = compiled('index.tpl.html')

export class Entries {
  public files: string[]
  public all: Entry[]

  constructor(pattern: string, src: string) {
    const ignoreGlob = '!node_modules'
    const files: string[] = glob.sync(
      Array.isArray(pattern) ? [...pattern, ignoreGlob] : [pattern, ignoreGlob]
    )

    this.files = files
    this.all = files.filter(Entry.check).map(file => new Entry({ file, src }))
  }

  public writeFiles(args: Partial<ConfigArgs>): void {
    const { theme, plugins, title, description } = args

    const rawIndexHtml = html({
      DESCRIPTION: description,
      TITLE: title,
    })

    const rawAppJs = app({
      ENTRIES: this.all,
      THEME: theme,
      WRAPPERS: propOf(plugins, 'wrapper'),
    })

    const rawIndexJs = js({
      AFTER_RENDERS: propOf(plugins, 'afterRender'),
      BEFORE_RENDERS: propOf(plugins, 'beforeRender'),
    })

    touch(paths.indexHtml, rawIndexHtml)
    touch(paths.appJs, rawAppJs)
    touch(paths.indexJs, rawIndexJs)
  }

  public map(): Record<string, string> {
    return this.all.reduce(
      (obj: any, entry: Entry) => ({
        ...obj,
        [entry.filepath]: entry.name,
      }),
      {}
    )
  }
}
