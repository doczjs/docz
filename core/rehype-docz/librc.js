const pkg = require('./package.json')

module.exports = {
  external: Object.keys(pkg.dependencies).concat([
    'docz-utils/lib/format',
    'docz-utils/lib/codesandbox',
  ]),
}
