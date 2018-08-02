const pkg = require('./package.json')

const internal = [
  'create-react-context',
  'react-copy-write',
  'react-imported-component',
]

const external = Object.keys(pkg.dependencies)
  .concat(['@mdx-js/tag/dist/mdx-provider'])
  .filter(dep => internal.indexOf(dep) === -1)

module.exports = {
  external,
}
