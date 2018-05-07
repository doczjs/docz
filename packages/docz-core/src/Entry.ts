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
      (child: any) => child.type === 'import' && /docz/.test(child.value)
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

  const name = found.value.match(/(doc\()(.+)(\))/)
  return name[2]
}

export class Entry {
  readonly [key: string]: any

  public static check(file: string): boolean | null {
    return checkImport(file)
  }

  public static parseName(file: string): string | null {
    return getNameFromDoc(file)
  }

  public id: string
  public slug: string
  public filepath: string

  constructor(file: string, src: string) {
    const srcPath = path.resolve(paths.root, src)
    const filepath = path.relative(srcPath, file)
    const name = Entry.parseName(file)

    this.id = ulid()
    this.slug = slugify(name)
    this.filepath = filepath
  }
}
