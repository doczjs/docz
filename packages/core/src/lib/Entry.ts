import slugify from '@sindresorhus/slugify';
import * as crypto from 'crypto';
import _ from 'lodash';
import path from 'path';

import type { Config } from '~/types';
import { getParsedData } from '~/utils/mdast';
import type { ParsedData } from '~/utils/mdast';
import { humanizeString } from '~/utils/string';

const createId = (file: string) =>
  crypto.createHash('md5').update(file).digest('hex');

export class Entry {
  #ast: any;
  #file: any;
  #config: Config;

  public link!: string | null;
  public filepath!: string;
  public fullpath!: string;
  public id!: string;
  public hidden!: boolean;
  public menu!: string | null;
  public name!: string;
  public route!: string;
  public slug!: string;
  public frontmatter!: {
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

    this.id = createId(file);
    this.filepath = filepath;
    this.fullpath = path.resolve(config.paths.root, file);
    this.link = '';
    this.hidden = parsed.hidden || false;
    this.slug = this.slugify(filepath);
    this.route = this.getRoute(parsed);
    this.name = name;
    this.menu = parsed.menu || '';
    this.frontmatter = parsed;
    return this;
  }

  public setLink(url: string): void {
    this.link = url.replace('{{filepath}}', this.filepath);
  }

  private getFilepath(config: Config, file: string): string {
    const root = config.paths.root;
    const fullpath = path.resolve(root, file);
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
    const parsedRoute = _.get(parsed, 'route');
    return parsedRoute || `/${this.slug}`;
  }
}
