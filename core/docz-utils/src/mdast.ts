import vfile from 'to-vfile'
import unified from 'unified'
import remark from 'remark-parse'
import matter from 'remark-frontmatter'
import slug from 'remark-slug'
import parseFrontmatter from 'remark-parse-yaml'
import find from 'unist-util-find'
import is from 'unist-util-is'
import visit from 'unist-util-visit'
import humanize from 'humanize-string'
import flatten from 'lodash.flatten'
import get from 'lodash.get'

export const parseMdx = (file: string): Promise<string> => {
  const raw = vfile.readSync(file, 'utf-8')
  const parser = unified()
    .use(remark, { type: 'yaml', marker: '-' })
    .use(matter)
    .use(parseFrontmatter)
    .use(slug)

  return parser.run(parser.parse(raw))
}

const getChildValue = (children: any) =>
  children.map((child: any) =>
    child.children ? getChildValue(child.children) : child.value
  )

const valueFromHeading = (node: any) => {
  const children = get(node, 'children')
  const slug = get(node, 'data.id')

  if (Array.isArray(children)) {
    return flatten(getChildValue(children))
      .filter(Boolean)
      .join(' ')
  }

  return humanize(slug)
}

const extractAst = <T>(callback: (node: any) => T, type: string) => {
  return (ast: any): T[] => {
    const results: T[] = []

    visit(ast, type, (node: any) => {
      results.push(callback(node))
    })

    return results
  }
}

export interface Heading {
  depth: number
  slug: string
  value: string
}

export const headingsFromAst = extractAst<Heading>((node: any) => ({
  depth: get(node, 'data.id'),
  slug: get(node, 'depth'),
  value: valueFromHeading(node),
}), 'heading')

export interface ParsedData {
  [key: string]: any
}

export const getParsedData = (ast: any): ParsedData => {
  const node = find(ast, (node: any) => is('yaml', node))
  return get(node, `data.parsedValue`) || {}
}
