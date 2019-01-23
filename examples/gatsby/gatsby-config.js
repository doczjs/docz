const path = require('path')
const { mdPlugins, hastPlugins } = require('./lib')

module.exports = {
  siteMetadata: {
    title: `Docz POC`,
    description: 'This is just an experiment to integrate Docz and Gatsby',
    author: 'Pedro Nauck',
  },
  plugins: [
    {
      resolve: `gatsby-mdx`,
      options: {
        mdPlugins,
        hastPlugins,
        defaultLayouts: {
          default: path.resolve('./src/components/layout.js'),
        },
      },
    },
    {
      resolve: `gatsby-plugin-react-helmet`,
    },
  ],
}
