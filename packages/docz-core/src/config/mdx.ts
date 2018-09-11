import matter from 'remark-frontmatter'
import slug from 'rehype-slug'
import remarkDocz from 'remark-docz'
import rehypeDocz from 'rehype-docz'

export const config = {
  type: 'yaml',
  marker: '-',
}

export const remarkPlugins = [matter, remarkDocz]
export const rehypePlugins = [rehypeDocz, slug]
