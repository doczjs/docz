const { get } = require('lodash/fp')
const { parseConfig } = require('docz-core')

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

module.exports = async ({ graphql, actions }, opts = {}) => {
  return graphql(ENTRIES_QUERY).then(async ({ data, errors }) => {
    const hasErrors = errors && errors.length > 0
    const entries = get('allDoczEntries.edges', data)
    if (!entries || entries.length === 0 || hasErrors) return
    const defaultEntry = entries.find(({ node: entry }) => entry.route === '/')
    if (defaultEntry === undefined) {
      const config = await parseConfig(opts)
      // Create a default entry unless specifically denied by config
      const shouldNotCreateRootRoute = Boolean(config.noRootRoute)
      if (shouldNotCreateRootRoute === false) {
        // Set the first found entry as the default entry
        const createdDefaultEntry = {
          node: {
            ...entries[0].node,
            route: '/',
          },
        }
        entries.unshift(createdDefaultEntry)
      }
    }
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
