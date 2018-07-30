import matter from 'remark-frontmatter'
import slug from 'rehype-slug'
import headings from 'rehype-autolink-headings'
import remarkDocz from 'remark-docz'
import rehypeDocz from 'rehype-docz'

export const config = {
  type: 'yaml',
  marker: '-',
  properties: {
    'aria-hidden': true,
  },
  content: {
    type: 'element',
    tagName: 'span',
    properties: {
      className: ['icon-link'],
    },
    children: [
      {
        type: 'text',
        value: '#',
      },
    ],
  },
}

export const remarkPlugins = [matter, remarkDocz]
export const rehypePlugins = [rehypeDocz, slug, headings]
