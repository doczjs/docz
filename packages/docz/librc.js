const pkg = require('./package.json')

const internal = [
  '@sindresorhus/slugify',
  'array-sort',
  'capitalize',
  'create-react-context',
  'react-imported-component',
  'react-router',
  'react-router-dom',
  'react-router-hash-link',
]

const depsExternal = ['@mdx-js/tag/dist/mdx-provider']

const external = Object.keys(pkg.dependencies)
  .concat(depsExternal)
  .filter(dep => internal.indexOf(dep) === -1)

module.exports = {
  external,
}
