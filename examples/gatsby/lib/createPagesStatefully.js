const path = require('path')
const setupWatcher = require('./setupWatcher')

const getEntry = async (filepath, entries) => {
  const map = await entries.get()
  return map[filepath]
}

module.exports = async ({ store, actions }) => {
  const { entries, watcher, config, paths } = await setupWatcher()
  const { createPage, deletePage } = actions

  const handleCreatePage = async filepath => {
    const component = path.join(paths.root, filepath)
    const entry = await getEntry(filepath, entries)

    if (entry) {
      createPage({
        component,
        path: entry.route,
        context: entry,
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
