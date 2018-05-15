import * as path from 'path'
import { ulid } from 'ulid'
import vfile from 'to-vfile'
import unified from 'unified'
import remark from 'remark-parse'
import matter from 'remark-frontmatter'
import parseFrontmatter from 'remark-parse-yaml'
import slugify from '@sindresorhus/slugify'
import find from 'unist-util-find'
import is from 'unist-util-is'
import get from 'lodash.get'

import * as paths from './config/paths'

export const parseMdx = (file: string): Promise<string> => {
  const raw = vfile.readSync(file, 'utf-8')
  const parser = unified()
    .use(remark, { type: 'yaml', marker: '-' })
    .use(matter)
    .use(parseFrontmatter)

  return parser.run(parser.parse(raw))
}

const getFromParsedData = (value: string) => (ast: any) => {
  const node = find(ast, (node: any) => is('yaml', node))
  return get(node, `data.parsedValue.${value}`)
}

const getName = getFromParsedData('name')
const getRoute = getFromParsedData('route')
const getMenu = getFromParsedData('menu')
const getOrder = getFromParsedData('order')

export class Entry {
  readonly [key: string]: any

  public static async check(file: string): Promise<boolean | null> {
    const ast = await parseMdx(file)
    return Boolean(getName(ast))
  }

  public id: string
  public filepath: string
  public slug: string
  public route: string
  public name: string
  public menu: string | null
  public order: number

  constructor(ast: any, file: string, src: string) {
    const filepath = this.getFilepath(file, src)

    this.id = ulid()
    this.filepath = filepath
    this.slug = this.slugify(filepath)
    this.route = this.getRoute(ast)
    this.name = getName(ast)
    this.menu = getMenu(ast)
    this.order = parseInt(getOrder(ast), 10) || 0
  }

  private getFilepath(file: string, src: string): string {
    const srcPath = path.resolve(paths.root, src)
    return path.relative(srcPath, file)
  }

  private slugify(filepath: string): string {
    const ext = path.extname(filepath)
    const fileWithoutExt = filepath.replace(ext, '')

    return slugify(fileWithoutExt)
  }

  private getRoute(ast: any): string {
    return getRoute(ast) || `/${this.slug}`
  }
}
