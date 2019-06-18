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

const getHastPlugins = rootPath => {
  let plugins = []

  try {
    plugins = [
      [require('rehype-docz'), { root: rootPath }],
      require('rehype-slug'),
    ]
  } catch (err) {
    plugins = []
  }

  return plugins
}

module.exports = opts => {
  const config = getDoczConfig(opts)
  const { paths } = config
  const mdPlugins = getMdPlugins()
  const hastPlugins = getHastPlugins(paths.root)

  return {
    plugins: [
      {
        resolve: 'gatsby-mdx',
        options: {
          extensions: ['.md', '.mdx'],
          remarkPlugins:
            config && config.mdPlugins
              ? config.mdPlugins.concat(mdPlugins)
              : mdPlugins,
          rehypePlugins:
            config && config.hastPlugins
              ? config.hastPlugins.concat(hastPlugins)
              : hastPlugins,
          defaultLayouts: {
            default: path.join(__dirname, 'src/base/Layout.js'),
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
        resolve: 'gatsby-plugin-emotion',
      },
      {
        resolve: 'gatsby-plugin-alias-imports',
        options: {
          alias: {
            '@docz/components': path.resolve(__dirname, 'src/docz/components'),
            '@docz/styles': path.resolve(__dirname, 'src/docz/styles'),
            '@docz/theme': path.resolve(__dirname, 'src/docz/theme'),
            '@docz/utils': path.resolve(__dirname, 'src/docz/utils'),
          },
        },
      },
      {
        resolve: 'gatsby-plugin-compile-es6-packages',
        options: {
          modules: ['docz', 'docz-core', 'gatsby-theme-docz'],
        },
      },
    ],
  }
}
