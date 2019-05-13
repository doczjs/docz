import * as path from 'path'
import * as crypto from 'crypto'
import slugify from '@sindresorhus/slugify'
import humanize from 'humanize-string'
import { get } from 'lodash/fp'

import {
  getParsedData,
  headingsFromAst,
  Heading,
  ParsedData,
} from 'docz-utils/lib/mdast'

import * as paths from '../config/paths'
import { Config } from '../config/argv'

const createId = (file: string) =>
  crypto
    .createHash('md5')
    .update(file)
    .digest('hex')

const mountRoute = (base: string, route: string) => {
  if (base === '/') return route
  const baseHasSlash = base.endsWith('/')
  if (baseHasSlash) return base.substr(0, base.length - 1) + route
  return base + route
}

export interface EntryObj {
  id: string
  filepath: string
  fullpath: string
  link: string | null
  slug: string
  name: string
  route: string
  menu: string | null
  headings: Heading[]
  [key: string]: any
}

export class Entry {
  readonly [key: string]: any

  public id: string
  public filepath: string
  public fullpath: string
  public link: string | null
  public slug: string
  public route: string
  public name: string
  public menu: string | null
  public headings: Heading[]
  public settings: {
    [key: string]: any
  }

  constructor(ast: any, file: string, src: string, config: Config) {
    const filepath = this.getFilepath(file, src)
    const parsed = getParsedData(ast)
    const name = this.getName(filepath, parsed)

    this.id = createId(file)
    this.filepath = filepath
    this.fullpath = path.resolve(config.root, file)
    this.link = ''
    this.slug = this.slugify(filepath, config.separator)
    this.route = this.getRoute(parsed, config.base)
    this.name = name
    this.menu = parsed.menu || ''
    this.headings = headingsFromAst(ast)
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

  private slugify(filepath: string, separator: string): string {
    const ext = path.extname(filepath)
    const fileWithoutExt = filepath.replace(ext, '')

    return slugify(fileWithoutExt, { separator })
  }

  private getRoute(parsed: any, base: string): string {
    const parsedRoute = get('route', parsed)
    const route = parsedRoute || `/${this.slug}`
    return mountRoute(base, route)
  }
}
