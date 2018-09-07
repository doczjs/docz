import * as path from 'path'
import * as crypto from 'crypto'
import slugify from '@sindresorhus/slugify'
import humanize from 'humanize-string'
import find from 'unist-util-find'
import is from 'unist-util-is'
import visit from 'unist-util-visit'
import get from 'lodash.get'

import * as paths from './config/paths'
import { valueFromHeading } from './utils/ast'

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
      value: valueFromHeading(node),
    })
  })

  return headings
}

const createId = (file: string) =>
  crypto
    .createHash('md5')
    .update(file)
    .digest('hex')

export interface EntryObj {
  id: string
  filepath: string
  link: string | null
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

  public id: string
  public filepath: string
  public link: string | null
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

    this.id = createId(file)
    this.filepath = filepath
    this.link = null
    this.slug = this.slugify(filepath)
    this.route = this.getRoute(parsed)
    this.name = name
    this.order = parsed.order || 0
    this.menu = parsed.menu || null
    this.headings = getHeadings(ast)
    this.settings = parsed
  }

  public setLink(url: string): void {
    if (url) {
      this.link = url.replace('{{filepath}}', this.filepath)
    }
  }

  private getFilepath(file: string, src: string): string {
    const srcPath = path.resolve(paths.root, src)
    const filepath = path.relative(srcPath, file)

    if (process.platform === 'win32') {
      return filepath.split('\\').join('/')
    }

    return filepath
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
