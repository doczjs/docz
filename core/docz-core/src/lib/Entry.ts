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
  public link: string | null
  public readonly filepath: string
  public readonly fullpath: string
  public readonly headings: Heading[]
  public readonly id: string
  public readonly menu: string | null
  public readonly name: string
  public readonly route: string
  public readonly settings: {
    [key: string]: any
  }
  public readonly slug: string

  constructor(ast: any, file: string, config: Config) {
    const filepath = this.getFilepath(config, file)
    const parsed = getParsedData(ast)
    const name = this.getName(filepath, parsed)
    const root = paths.getRootDir(config)

    this.id = createId(file)
    this.filepath = filepath
    this.fullpath = path.resolve(root, file)
    this.link = ''
    this.slug = this.slugify(filepath, config.separator)
    this.route = this.getRoute(parsed)
    this.name = name
    this.menu = parsed.menu || ''
    this.headings = headingsFromAst(ast)
    this.settings = parsed
  }

  public setLink(url: string): void {
    this.link = url.replace('{{filepath}}', this.filepath)
  }

  private getFilepath(config: Config, file: string): string {
    const root = paths.getRootDir(config)
    const fullpath = path.resolve(root, config.src, file)
    const filepath = path.relative(root, fullpath)

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

  private getRoute(parsed: any): string {
    const parsedRoute = get('route', parsed)
    return parsedRoute || `/${this.slug}`
  }
}
