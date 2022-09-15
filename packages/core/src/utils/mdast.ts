/* eslint-disable @typescript-eslint/no-explicit-any */
import flatten from 'lodash/flatten';
import get from 'lodash/get';

import humanizeString from './string';

export const parseMdx = async (file: string, plugins: any[]) => {
  const { default: matter } = await import('remark-frontmatter');
  const { default: remarkParse } = await import('remark-parse');
  const { default: parseFrontmatter } = await import('remark-parse-yaml');
  const { default: slug } = await import('remark-slug');
  const { default: stringify } = await import('rehype-stringify');
  const { default: gfm } = await import('remark-gfm');
  const { default: meta } = await import('rehype-meta');

  const { toVFile } = await import('to-vfile');
  const { unified } = await import('unified');

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
  const children = get(node, 'children');
  const slug = get(node, 'data.id');

  if (Array.isArray(children)) {
    return flatten(getChildValue(children)).filter(Boolean).join(' ');
  }

  return humanizeString(slug);
};

async function extractAst<T>(callback: (node: any) => T, type: string) {
  const { visit } = await import('unist-util-visit');
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
      slug: get(node, 'data.id'),
      depth: get(node, 'depth'),
      value: valueFromHeading(node),
    }),
    'heading'
  );
};

export interface ParsedData {
  [key: string]: any;
}

export const getParsedData = async (ast: any): Promise<ParsedData> => {
  const { default: find } = await import('unist-util-find');
  const node = find(ast, { type: 'yaml' });
  return get(node, `data.parsedValue`) || {};
};
