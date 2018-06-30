import * as path from 'path'
import { ulid } from 'ulid'
import vfile from 'to-vfile'
import unified from 'unified'
import remark from 'remark-parse'
import matter from 'remark-frontmatter'
import slug from 'remark-slug'
import parseFrontmatter from 'remark-parse-yaml'
import slugify from '@sindresorhus/slugify'
import find from 'unist-util-find'
import is from 'unist-util-is'
import visit from 'unist-util-visit'
import get from 'lodash.get'
import humanize from 'humanize-string'

import * as paths from './config/paths'

export const parseMdx = (file: string): Promise<string> => {
  const raw = vfile.readSync(file, 'utf-8')
  const parser = unified()
    .use(remark, { type: 'yaml', marker: '-' })
    .use(matter)
    .use(parseFrontmatter)
    .use(slug)

  return parser.run(parser.parse(raw))
}

interface ParsedData {
  [key: string]: any
}

const getParsedData = (ast: any): ParsedData => {
  const node = find(ast, (node: any) => is('yaml', node))
  return get(node, `data.parsedValue`) || {}
}

export interface Heading {
  depth: number
  slug: string
  value: string
}

const getHeadings = (ast: any): Heading[] => {
  const headings: Heading[] = []

  visit(ast, 'heading', (node: any) => {
    const slug = get(node, 'data.id')
    const depth = get(node, 'depth')

    headings.push({
      depth,
      slug,
      value: humanize(slug),
    })
  })

  return headings
}

export interface EntryObj {
  id: string
  filepath: string
  slug: string
  name: string
  route: string
  order: number
  menu: string | null
  headings: Heading[]
  [key: string]: any
}

export class Entry {
  readonly [key: string]: any

  public static async check(file: string): Promise<boolean | null> {
    const ast = await parseMdx(file)
    const parsed = getParsedData(ast)
    return Boolean(parsed && parsed.name)
  }

  public id: string
  public filepath: string
  public slug: string
  public route: string
  public name: string
  public order: number
  public menu: string | null
  public headings: Heading[]
  public settings: {
    [key: string]: any
  }

  constructor(ast: any, file: string, src: string) {
    const filepath = this.getFilepath(file, src)
    const parsed = getParsedData(ast)
    const name = this.getName(filepath, parsed)

    this.id = ulid()
    this.filepath = filepath
    this.slug = this.slugify(filepath)
    this.route = this.getRoute(parsed)
    this.name = name
    this.order = parsed.order || 0
    this.menu = parsed.menu || null
    this.headings = getHeadings(ast)
    this.settings = parsed
  }

  private getFilepath(file: string, src: string): string {
    const srcPath = path.resolve(paths.root, src)
    const relativePath = path.relative(srcPath, file)

    if (process.platform === 'win32') {
      return relativePath.split('\\').join('/')
    }

    return relativePath
  }

  private getName(filepath: string, parsed: ParsedData): string {
    const filename = humanize(path.parse(filepath).name)
    return parsed && parsed.name ? parsed.name : filename
  }

  private slugify(filepath: string): string {
    const ext = path.extname(filepath)
    const fileWithoutExt = filepath.replace(ext, '')

    return slugify(fileWithoutExt)
  }

  private getRoute(parsed: any): string {
    return parsed && parsed.route ? parsed.route : `/${this.slug}`
  }
}
