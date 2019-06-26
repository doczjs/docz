const { get } = require('lodash/fp')

const ENTRIES_QUERY = `
  {
    allDoczEntries{
      edges{
        node{
          id
          filepath
          fullpath
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

module.exports = ({ graphql, actions, ...props }) => {
  return graphql(ENTRIES_QUERY).then(({ data, errors }) => {
    const hasErrors = errors && errors.length > 0
    const entries = get('allDoczEntries.edges', data)
    if (!entries || entries.length === 0 || hasErrors) return

    entries.forEach(({ node: entry }) => {
      if (!entry) return
      actions.createPage({
        component: entry.fullpath,
        path: entry.route,
        context: {
          entry,
        },
      })
    })
  })
}
