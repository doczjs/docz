import matter from 'remark-frontmatter'
import slug from 'rehype-slug'
import detectChanged from 'detect-one-changed/remark-plugin'
import remarkDocz from 'remark-docz'
import rehypeDocz from 'rehype-docz'

import * as paths from './paths'
import { Config } from '../commands/args'

export const config = {
  type: 'yaml',
  marker: '-',
}

export const remarkPlugins = () => [detectChanged, matter, remarkDocz]
export const rehypePlugins = (config: Config) => [
  rehypeDocz(paths.root, config.codeSandbox),
  slug,
]
