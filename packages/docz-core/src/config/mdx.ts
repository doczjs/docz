import matter from 'remark-frontmatter'
import slug from 'rehype-slug'
import headings from 'rehype-autolink-headings'

import { plugin as mdastPlugin } from '../utils/plugin-mdast'
import { plugin as hastPlugin } from '../utils/plugin-hast'

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

export const remarkPlugins = [matter, mdastPlugin]
export const rehypePlugins = [hastPlugin, slug, headings]
