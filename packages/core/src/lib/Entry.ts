/* eslint-disable @typescript-eslint/no-explicit-any */
import * as crypto from 'crypto';
import { get } from 'lodash/fp';
import * as path from 'path';
import slugify from 'slugify';

import * as paths from '../config/paths';

import type { Config } from '~/types';
import { getParsedData, headingsFromAst } from '~/utils/mdast';
import type { ParsedData, Heading } from '~/utils/mdast';
import { humanizeString } from '~/utils/string';

const createId = (file: string) =>
  crypto.createHash('md5').update(file).digest('hex');

export interface EntryObj {
  id: string;
  filepath: string;
  fullpath: string;
  link: string | null;
  slug: string;
  name: string;
  route: string;
  menu: string | null;
  [key: string]: any;
}

export class Entry {
  #ast: any;
  #file: any;
  #config: any;

  public link!: string | null;
  public filepath!: string;
  public fullpath!: string;
  public headings!: Heading[];
  public id!: string;
  public hidden!: boolean;
  public menu!: string | null;
  public name!: string;
  public route!: string;
  public slug!: string;
  public settings!: {
    [key: string]: any;
  };

  constructor(ast: any, file: string, config: Config) {
    this.#file = file;
    this.#config = config;
    this.#ast = ast;
  }

  public async populate() {
    const config = this.#config;
    const ast = this.#ast;
    const file = this.#file;
    const filepath = this.getFilepath(config, file);
    const parsed = await getParsedData(ast);
    const name = this.getName(filepath, parsed);
    const root = paths.getRootDir(config);

    this.id = createId(file);
    this.filepath = filepath;
    this.fullpath = path.resolve(root, file);
    this.link = '';
    this.hidden = parsed.hidden || false;
    this.slug = this.slugify(filepath);
    this.route = this.getRoute(parsed);
    this.name = name;
    this.menu = parsed.menu || '';
    this.headings = (await headingsFromAst())(ast);
    this.settings = parsed;
  }

  public setLink(url: string): void {
    this.link = url.replace('{{filepath}}', this.filepath);
  }

  private getFilepath(config: Config, file: string): string {
    const root = paths.getRootDir(config);
    const fullpath = path.resolve(root, config.src, file);
    const filepath = path.relative(root, fullpath);

    if (process.platform === 'win32') {
      return filepath.split('\\').join('/');
    }

    return filepath;
  }

  private getName(filepath: string, parsed: ParsedData): string {
    const filename = humanizeString(path.parse(filepath).name);
    return parsed && parsed.name ? parsed.name : filename;
  }

  private slugify(filepath: string): string {
    const ext = path.extname(filepath);
    const fileWithoutExt = filepath.replace(ext, '');

    return slugify(fileWithoutExt);
  }

  private getRoute(parsed: any): string {
    const parsedRoute = get('route', parsed);
    return parsedRoute || `/${this.slug}`;
  }
}
