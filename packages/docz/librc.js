const pkg = require('./package.json')

module.exports = {
  external: Object.keys(pkg.dependencies).concat([
    '@mdx-js/tag/dist/mdx-provider',
  ]),
}
