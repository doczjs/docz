const pkg = require('./package.json')

const internal = [
  '@sindresorhus/slugify',
  'create-react-context',
  'array-sort',
  'capitalize',
  'react-imported-component',
]

const depsExternal = ['@mdx-js/tag/dist/mdx-provider']

const external = Object.keys(pkg.dependencies)
  .concat(depsExternal)
  .filter(dep => internal.indexOf(dep) === -1)

module.exports = {
  external,
}
