const path = require('path')
const chokidar = require('chokidar')
const { parseConfig, Entries } = require('docz-core')
const { mockArgv } = require('./argv')

module.exports = async () => {
  const { paths, ...config } = await parseConfig(mockArgv)
  const src = path.relative(paths.root, config.src)
  const files = path.join(src, config.files)
  const entries = new Entries(config)
  const watcher = chokidar.watch(files, {
    cwd: paths.root,
    ignored: /(((^|[\/\\])\..+)|(node_modules))/,
    persistent: true,
  })

  return { entries, watcher, paths, config }
}
