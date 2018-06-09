const copy = require('rollup-plugin-cpy')
const pkg = require('./package.json')

module.exports = {
  external: Object.keys(pkg.dependencies).concat([
    'react-dev-utils/FileSizeReporter',
    'react-dev-utils/formatWebpackMessages',
    'react-dev-utils/printBuildError',
    'react-dom/server',
  ]),
  plugins: [
    copy([
      {
        files: 'templates/*.{js,html,json}',
        dest: 'dist/templates',
      },
    ]),
  ],
}
