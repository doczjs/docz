import * as glob from 'fast-glob'
import * as t from 'babel-types'
import * as fs from 'fs'
import * as path from 'path'
import * as mkdir from 'mkdirp'
import * as prettier from 'prettier'
import { NodePath } from 'babel-traverse'
import { compile } from 'art-template'

import * as paths from './config/paths'

import { traverseAndAssign } from './utils/traverse'
import { Entry, convertToAst } from './Entry'
import { Plugin, PluginFactory } from './Plugin'

const hasImport = (filepath: NodePath<any>): boolean =>
  filepath.isImportDeclaration() &&
  filepath.node &&
  filepath.node.source &&
  filepath.node.source.value === 'docz'

const hasDocFn = (filepath: NodePath<any>): boolean =>
  filepath.node.specifiers &&
  filepath.node.specifiers.some(
    (node: NodePath<any>) =>
      t.isImportSpecifier(node) && node.imported.name === 'doc'
  )

const checkImport = traverseAndAssign<NodePath<t.Node>, boolean>({
  assign: () => true,
  when: p => hasImport(p) && hasDocFn(p),
})

const isFile = (entry: string) => checkImport(convertToAst(entry))

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

const propOf = (arr: any[], method: keyof PluginFactory) =>
  arr && arr.map(p => p[method]).filter(m => m)

const app = compiled('app.tpl.js')
const js = compiled('index.tpl.js')
const html = compiled('index.tpl.html')

export interface GenerateFilesParams {
  entries: Entry[]
  plugins: Plugin[]
  theme: string
}

export class Entries {
  public static generateFiles(args: GenerateFilesParams): void {
    const { entries, theme, plugins } = args

    touch(paths.indexHtml, html({}))

    touch(
      paths.appJs,
      app({
        ENTRIES: entries,
        THEME: theme,
        WRAPPERS: propOf(plugins, 'wrapper'),
      })
    )

    touch(
      paths.indexJs,
      js({
        AFTER_RENDERS: propOf(plugins, 'afterRender'),
        BEFORE_RENDERS: propOf(plugins, 'beforeRender'),
      })
    )
  }

  public files: string[]
  public all: Entry[]

  constructor(pattern: string, src: string) {
    const ignoreGlob = '!node_modules'
    const files: string[] = glob.sync(
      Array.isArray(pattern) ? [...pattern, ignoreGlob] : [pattern, ignoreGlob]
    )

    this.files = files
    this.all = files.filter(isFile).map(file => new Entry({ file, src }))
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
