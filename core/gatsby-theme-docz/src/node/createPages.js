const path = require('path')
const { getDoczConfig } = require('../utils/parseConfig')
const { get } = require('lodash/fp')

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
  const { paths } = getDoczConfig(opts)

  return graphql(ENTRIES_QUERY).then(({ data, errors }) => {
    const hasErrors = errors && errors.length > 0
    const entries = get('allDoczEntries.edges', data)
    if (!entries || entries.length === 0 || hasErrors) return

    entries.forEach(({ node: entry }) => {
      if (!entry) return
      const component = path.join(paths.root, entry.filepath)
      actions.createPage({
        component,
        path: entry.route,
        context: {
          entry,
        },
      })
    })
  })
}
