require('dotenv').config()

const query = `{
  pages: allMdx {
    edges {
      node {
        objectID: id
        frontmatter {
          title
          route
        }
        excerpt(pruneLength: 5000)
      }
    }
  }
}`

const flatten = arr =>
  arr.map(({ node: { frontmatter, ...rest } }) => ({
    ...frontmatter,
    ...rest,
  }))

const settings = { attributesToSnippet: [`excerpt:20`] }
const queries = [
  {
    query: query,
    transformer: ({ data }) => flatten(data.pages.edges),
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
