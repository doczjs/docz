import * as path from 'path'
import { ulid } from 'ulid'
import vfile from 'to-vfile'
import unified from 'unified'
import remark from 'remark-parse'
import toMDXAST from '@mdx-js/mdxast'
import slugify from '@sindresorhus/slugify'
import find from 'unist-util-find'
import is from 'unist-util-is'

import * as paths from './config/paths'

const parseMdx = (file: string) => {
  const raw = vfile.readSync(file, 'utf-8')
  const mdx = toMDXAST()
  const tree = unified()
    .use(remark)
    .parse(raw)

  return mdx(tree)
}

const hasDoczImported = (node: any) =>
  is('import', node) && /docz/.test(node.value)

const getNameFromTree = (node: any) =>
  is('export', node) &&
  /export const meta/.test(node.value) &&
  /doc\(.+\)/.test(node.value)

const checkImport = (file: string) => {
  const ast = parseMdx(file)
  return Boolean(find(ast, hasDoczImported))
}

const getNameFromDoc = (file: string) => {
  const ast = parseMdx(file)
  const node = find(ast, getNameFromTree)

  const match = node && node.value.match(/doc\((\'|\")(.+)(\'|\")/)
  return match ? match[2] : null
}

export class Entry {
  readonly [key: string]: any

  public static check(file: string): boolean | null {
    return checkImport(file) && Boolean(getNameFromDoc(file))
  }

  public static slug(file: string): string | null {
    const name = getNameFromDoc(file)
    return name ? slugify(name) : null
  }

  public id: string
  public filepath: string
  public slug: string | null

  constructor(file: string, src: string) {
    const srcPath = path.resolve(paths.root, src)
    const filepath = path.relative(srcPath, file)

    this.id = ulid()
    this.slug = Entry.slug(file)
    this.filepath = filepath
  }
}
