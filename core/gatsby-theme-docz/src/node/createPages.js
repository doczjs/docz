const path = require('path')
const { getDoczConfig } = require('../utils/parseConfig')

const mountRoute = (base = '/', route) => {
  return `${base === '/' ? '' : base}${route}`
}

const ENTRIES_QUERY = `
  {
    allDoczEntries{
      edges{
        node{
          id
          filepath
          route
          slug
          name
          menu
          order
          headings {
            slug
            depth
            value
          }
        }
      }
    }
  }
`

module.exports = ({ graphql, actions }, opts) => {
  const { paths, ...config } = getDoczConfig(opts)

  return graphql(ENTRIES_QUERY).then(({ data, errors }) => {
    const hasErrors = errors && errors.length > 0
    const entries = data && data.allDoczEntries.edges
    if (!entries || entries.length === 0 || hasErrors) return

    entries.forEach(({ node: entry }) => {
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
