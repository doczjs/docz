// noop
exports.mdPlugins = [
  [require('remark-frontmatter'), { type: 'yaml', marker: '-' }],
  require('remark-docz'),
]

exports.hastPlugins = [
  require('rehype-slug'),
  [require('rehype-docz'), { root: process.cwd() }],
]
