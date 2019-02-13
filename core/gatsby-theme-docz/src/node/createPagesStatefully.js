const path = require('path')
const chokidar = require('chokidar')
const { Entries } = require('docz-core')
const { parseConfig } = require('../utils/parseConfig')

const getEntry = async (filepath, entries) => {
  const map = await entries.get()
  return map[filepath]
}

const mountRoute = (base = '/', route) => {
  return `${base === '/' ? '' : base}${route}`
}

module.exports = async ({ store, actions }, opts) => {
  const { createPage, deletePage } = actions
  const { paths, ...config } = await parseConfig(opts)
  const src = path.relative(paths.root, config.src)
  const files = path.join(src, config.files)
  const entries = new Entries(config)
  const watcher = chokidar.watch(files, {
    cwd: paths.root,
    ignored: /(((^|[\/\\])\..+)|(node_modules))/,
    persistent: true,
  })

  const handleCreatePage = async filepath => {
    const component = path.join(paths.root, filepath)
    const entry = await getEntry(filepath, entries)

    if (entry) {
      createPage({
        component,
        path: mountRoute(config.base, entry.route),
        context: {
          entry,
        },
      })
    }
  }

  const handleDeletePage = filepath => {
    const { pages } = store.getState()
    const page = Array.from(pages.values()).find(
      page => page.context.entry && page.context.entry.filepath === filepath
    )

    if (page) {
      deletePage(page)
    }
  }

  return new Promise((resolve, reject) => {
    watcher
      .on('add', handleCreatePage)
      .on('change', handleCreatePage)
      .on('unlink', handleDeletePage)
      .on('ready', () => resolve())
      .on('error', err => reject(err))
  })
}
