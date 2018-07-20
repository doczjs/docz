const svg = require('rollup-plugin-svg')

module.exports = {
  external: [
    'docz',
    'react',
    'react-dom',
    'react-router',
    'react-router-dom',
    'prop-types',
  ],
  plugins: [svg()],
}
