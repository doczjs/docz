/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import meta from 'rehype-meta';
import stringify from 'rehype-stringify';
import matter from 'remark-frontmatter';
import gfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import parseFrontmatter from 'remark-parse-yaml';
import slug from 'remark-slug';
import { toVFile } from 'to-vfile';
import { unified } from 'unified';
import find from 'unist-util-find';
import { visit } from 'unist-util-visit';

import { humanizeString } from './string';

export const parseMdx = async (file: string, plugins: any[]) => {
  const raw = toVFile.readSync(file, 'utf-8');
  const parser = unified()
    .use(remarkParse)
    .use(gfm)
    .use(parseFrontmatter)
    .use(matter, ['yaml'])
    .use(meta)
    .use(slug)
    .use(stringify);

  for (const plugin of plugins) {
    const [item, opts = {}] = Array.isArray(plugin) ? plugin : [plugin];
    parser.use(item, opts);
  }

  return parser.run(parser.parse(raw));
};

const getChildValue = (children: any) =>
  children.map((child: any) =>
    child.children ? getChildValue(child.children) : child.value
  );

const valueFromHeading = (node: any) => {
  const children = _.get(node, 'children');
  const slug = _.get(node, 'data.id');

  if (Array.isArray(children)) {
    return _.flatten(getChildValue(children)).filter(Boolean).join(' ');
  }

  return humanizeString(slug);
};

async function extractAst<T>(callback: (node: any) => T, type: string) {
  return (ast: any) => {
    const results: T[] = [];

    visit(ast, type, (node: any) => {
      results.push(callback(node));
    });

    return results;
  };
}

export interface Heading {
  depth: number;
  slug: string;
  value: string;
}

export const headingsFromAst = async () => {
  return extractAst<Heading>(
    (node: any) => ({
      slug: _.get(node, 'data.id'),
      depth: _.get(node, 'depth'),
      value: valueFromHeading(node),
    }),
    'heading'
  );
};

export interface ParsedData {
  [key: string]: any;
}

export const getParsedData = async (ast: any): Promise<ParsedData> => {
  const node = find(ast, { type: 'yaml' });
  return _.get(node, `data.parsedValue`) || {};
};
