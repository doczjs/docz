const pkg = require('./package.json')

const external = Object.keys(pkg.dependencies).concat([
  '@mdx-js/tag/dist/mdx-provider',
])

module.exports = {
  external,
}
