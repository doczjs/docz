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

const getRehypePlugins = () => {
  let plugins = []

  try {
    plugins = [require('rehype-docz'), require('rehype-slug')]
  } catch (err) {
    plugins = []
  }

  return plugins
}

const getGatsbyRemarkPlugins = () => {
  return []
}

module.exports = opts => {
  const config = getDoczConfig(opts)
  const mdPlugins = getRemarkPlugins()
  const hastPlugins = getRehypePlugins()
  const gatsbyRemarkPlugins = getGatsbyRemarkPlugins()

  return {
    plugins: [
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          ignore: [
            `${config.paths.docz}/**/*`,
            // gatsby cache
            `${config.paths.root}/.cache/**/*`,
            // static assets with gatsby site setup
            `${config.paths.root}/public/**/*`,
            // ignore node_modules unless user explicitly asks for them to be included
            config.src.indexOf('node_modules') === -1
              ? `${config.paths.root}/node_modules/**/*`
              : `${config.paths.root}/node_modules/.cache/**/*`,
          ],
          path: config.paths.root,
        },
      },
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
          gatsbyRemarkPlugins:
            config && config.gatsbyRemarkPlugins
              ? config.gatsbyRemarkPlugins.concat(gatsbyRemarkPlugins)
              : gatsbyRemarkPlugins,
          defaultLayouts: {
            default: path.join(__dirname, 'src/base/Layout.js'),
          },
        },
      },
      {
        resolve: 'gatsby-plugin-react-helmet-async',
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
