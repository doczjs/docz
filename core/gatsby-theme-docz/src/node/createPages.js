const path = require('path')
const { getDoczConfig } = require('../utils/parseConfig')

const parseDatabase = data => {
  try {
    return JSON.parse(data.doczDb.db)
  } catch (err) {
    return null
  }
}

const mountRoute = (base = '/', route) => {
  return `${base === '/' ? '' : base}${route}`
}

module.exports = ({ graphql, actions }, opts) => {
  const { paths, ...config } = getDoczConfig(opts)

  return graphql(`
    {
      doczDb {
        id
        db
      }
    }
  `).then(({ data, errors }) => {
    const db = parseDatabase(data)
    const hasErrors = errors && errors.length > 0
    const hasEntries = db && db.entries && db.entries.length > 0
    if (!hasEntries || hasErrors) return

    db.entries.forEach(({ value: entry }) => {
      if (!entry) return
      const component = path.join(paths.root, entry.filepath)
      actions.createPage({
        component,
        path: mountRoute(config.base, entry.route),
        context: {
          entry,
        },
      })
    })
  })
}
