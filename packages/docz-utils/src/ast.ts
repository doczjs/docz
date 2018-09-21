import vfile from 'to-vfile'
import unified from 'unified'
import remark from 'remark-parse'
import matter from 'remark-frontmatter'
import slug from 'remark-slug'
import parseFrontmatter from 'remark-parse-yaml'
import visit from 'unist-util-visit'
import humanize from 'humanize-string'
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

const valueFromHeading = (node: any): string => {
  const children = get(node, 'children')
  const slug = get(node, 'data.id')

  if (Array.isArray(children)) {
    return children
      .map((child: any) => child.value)
      .filter(Boolean)
      .join(' ')
  }

  return humanize(slug)
}

export interface Heading {
  depth: number
  slug: string
  value: string
}

export const headingsFromAst = (ast: any): Heading[] => {
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

export const propsOfComponent = (component: string, prop: string) => (
  ast: any
) => {
  return []
}
