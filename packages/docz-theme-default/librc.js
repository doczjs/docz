const svg = require('rollup-plugin-svg')

module.exports = {
  plugins: [svg()],
  external: ['docz', 'react', 'react-dom', 'react-router', 'react-router-dom'],
  commonjs: {
    namedExports: {
      '../../node_modules/react-spinners/index.js': ['HashLoader'],
    },
  },
}
