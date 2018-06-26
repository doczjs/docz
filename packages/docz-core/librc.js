const pkg = require('./package.json')
const fs = require('fs-extra')
const cpy = require('cpy')

const copy = (files, dest) => ({
  name: 'copy',
  onwrite: () => {
    fs.ensureDirSync(dest)
    cpy(files, dest)
  },
})

module.exports = {
  external: Object.keys(pkg.dependencies).concat([
    'react-dev-utils/FileSizeReporter',
    'react-dev-utils/formatWebpackMessages',
    'react-dev-utils/printBuildError',
    'react-dom/server',
  ]),
  plugins: [copy('templates/*.{js,html,json}', 'dist/templates')],
}
