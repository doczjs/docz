const pkg = require('./package.json')

module.exports = {
  external: Object.keys(pkg.dependencies).concat([
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
  ]),
}
