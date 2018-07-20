const svg = require('rollup-plugin-svg')
const pkg = require('./package.json')

module.exports = {
  external: Object.keys(pkg.dependencies),
  plugins: [svg()],
}
