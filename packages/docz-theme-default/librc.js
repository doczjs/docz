const svg = require('rollup-plugin-svg')

module.exports = {
  plugins: [svg()],
  commonjs: {
    namedExports: {
      '../../node_modules/react-spinners/index.js': ['HashLoader'],
    },
  },
}
