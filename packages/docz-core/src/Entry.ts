import * as fs from 'fs'
import * as path from 'path'
import { ulid } from 'ulid'
import unified from 'unified'
import remark from 'remark-parse'
import toMDXAST from '@mdx-js/mdxast'
import slugify from '@sindresorhus/slugify'

import * as paths from './config/paths'

const parseMdx = (file: string) => {
  const raw = fs.readFileSync(file, 'utf-8')
  const tree = unified()
    .use(remark)
    .parse(raw)

  return toMDXAST({})(tree)
}

const checkImport = (file: string) => {
  const ast = parseMdx(file)

  return (
    ast.children &&
    ast.children.some(
      (child: any) =>
        child && child.type === 'import' && /docz/.test(child.value)
    )
  )
}

const getNameFromDoc = (file: string) => {
  const ast = parseMdx(file)
  const found =
    ast.children &&
    ast.children.find(
      (child: any) =>
        child &&
        child.type === 'export' &&
        /export const meta/.test(child.value) &&
        /doc\(.+\)/.test(child.value)
    )

  const name = found && found.value.match(/(doc\()(.+)(\))/)
  return name ? name[2] : null
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
