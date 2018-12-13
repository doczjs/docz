const pkg = require('./package.json')

const internal = []

const depsExternal = [
  '~db',
  '~imports',
  '@sindresorhus/slugify',
  '@mdx-js/tag/dist/mdx-provider',
  'array-sort',
  'capitalize',
  'create-react-context',
  'lodash/fp',
  'react-imported-component',
  'react-router',
  'react-router-dom',
  'react-router-hash-link',
  'ulid',
]

const external = Object.keys(pkg.dependencies)
  .concat(depsExternal)
  .filter(dep => internal.indexOf(dep) === -1)

module.exports = {
  external,
}
