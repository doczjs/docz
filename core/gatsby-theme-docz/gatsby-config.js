const path = require('path')

const { getDoczConfig } = require('./src/utils/parseConfig')

const getMdPlugins = () => {
  let plugins = []

  try {
    plugins = [
      [require('remark-frontmatter'), { type: 'yaml', marker: '-' }],
      require('remark-docz'),
    ]
  } catch (err) {
    plugins = []
  }

  return plugins
}

const getHastPlugins = () => {
  let plugins = []

  try {
    plugins = [
      [require('rehype-docz'), { root: process.cwd() }],
      require('rehype-slug'),
    ]
  } catch (err) {
    plugins = []
  }

  return plugins
}

module.exports = opts => {
  const { paths, ...config } = getDoczConfig(opts)
  const mdPlugins = getMdPlugins()
  const hastPlugins = getHastPlugins()

  return {
    plugins: [
      {
        resolve: 'gatsby-mdx',
        options: {
          extensions: ['.md', '.mdx'],
          mdPlugins:
            config && config.mdPlugins
              ? config.mdPlugins.concat(mdPlugins)
              : mdPlugins,
          hastPlugins:
            config && config.hastPlugins
              ? config.hastPlugins.concat(hastPlugins)
              : hastPlugins,
          defaultLayouts: {
            default: path.join(paths.app, 'components/Layout.js'),
          },
        },
      },
      {
        resolve: 'gatsby-plugin-react-helmet',
      },
      {
        resolve: 'gatsby-plugin-root-import',
      },
      {
        resolve: 'gatsby-plugin-styled-components',
      },
      {
        resolve: 'gatsby-plugin-compile-es6-packages',
        options: {
          modules: ['gatsby-theme-docz', 'react-live'],
        },
      },
    ],
  }
}
