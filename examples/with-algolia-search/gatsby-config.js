require('dotenv').config()
const get = require('lodash/get')
const merge = require('lodash/merge')

const query = `
{
  allMdx {
    edges {
      node {
        excerpt(pruneLength: 5000)
      }
    }
  }
  allDoczEntries {
    edges {
      node {
        objectID: id
        filepath
        slug
        name
      }
    }
  }
}
`

// List of attributes to snippet, with an optional maximum number of words to snippet.
const settings = { attributesToSnippet: [`excerpt:20`] }
const queries = [
  {
    query: query,
    transformer: gqlResponse => {
      const allMdx = get(gqlResponse, 'data.allMdx.edges', []).map(
        ({ node }) => node
      )
      const allDoczEntries = get(
        gqlResponse,
        'data.allDoczEntries.edges',
        []
      ).map(({ node }) => node)
      const records = merge(allMdx, allDoczEntries)
      return records
    },
    settings,
  },
]

module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        indexName: process.env.ALGOLIA_INDEX_NAME,
        queries,
        chunkSize: 10000, // default: 1000
      },
    },
  ],
}
