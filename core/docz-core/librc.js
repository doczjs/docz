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
  plugins: [copy('templates/*.{js,html,json}', 'dist/templates')],
  external: Object.keys(pkg.dependencies).concat([
    'crypto',
    'lodash/fp',
    'docz-utils/lib/fs',
    'react-dev-utils/errorOverlayMiddleware',
    'react-dev-utils/evalSourceMapMiddleware',
    'react-dev-utils/FileSizeReporter',
    'react-dev-utils/formatWebpackMessages',
    'react-dev-utils/getCacheIdentifier',
    'react-dev-utils/ignoredFiles',
    'react-dev-utils/WatchMissingNodeModulesPlugin',
    'react-dev-utils/WebpackDevServerUtils',
    'react-dom/server',
  ]),
}
