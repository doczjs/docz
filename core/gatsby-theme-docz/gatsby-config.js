const path = require('path')

const { mdPlugins, hastPlugins } = require('./src/utils/remark-plugins')
const { getDoczConfig } = require('./src/utils/parseConfig')

module.exports = opts => {
  const config = getDoczConfig(opts)
  return {
    plugins: [
      {
        resolve: 'gatsby-mdx',
        options: {
          extensions: ['.md', '.mdx'],
          mdPlugins: config.mdPlugins.concat(mdPlugins),
          hastPlugins: config.hastPlugins.concat(hastPlugins),
          defaultLayouts: {
            default: path.resolve(__dirname, 'src/components/Layout.js'),
          },
        },
      },
      {
        resolve: 'gatsby-plugin-react-helmet',
      },
      {
        resolve: 'gatsby-plugin-compile-es6-packages',
        options: {
          modules: ['gatsby-theme-docz'],
        },
      },
    ],
  }
}
