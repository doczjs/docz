const path = require('path')
const { getDoczConfig } = require('./lib/utils/parseConfig')

const getRemarkPlugins = () => {
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

const getRehypePlugins = rootPath => {
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
  const mdPlugins = getRemarkPlugins()
  const hastPlugins = getRehypePlugins(paths.root)

  return {
    plugins: [
      {
        resolve: 'gatsby-plugin-mdx',
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
            '~components': path.resolve(__dirname, 'src/components'),
            '~styles': path.resolve(__dirname, 'src/styles'),
            '~theme': path.resolve(__dirname, 'src/theme'),
            '~utils': path.resolve(__dirname, 'src/utils'),
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
