const fs = require('fs-extra')
const path = require('path')
const { Plugin, parseConfig } = require('docz-core')

const nodeModules = path.resolve(__dirname, 'node_modules')
const parentNodeModules = path.resolve(__dirname, '../../../node_modules')

module.exports = async (params, opts) => {
  const { stage, actions, getConfig } = params
  const hasParentNodeModules = fs.pathExistsSync(parentNodeModules)
  const args = await parseConfig(opts)
  const run = Plugin.runPluginsMethod(args.plugins)
  const config = getConfig()

  if (args.typescript) {
    actions.setWebpackConfig({
      resolve: {
        extensions: config.resolve.extensions.concat(['.ts', '.tsx']),
      },
    })
  }

  if (hasParentNodeModules) {
    actions.setWebpackConfig({
      resolve: {
        modules: [nodeModules, parentNodeModules],
      },
    })
  }

  run('onCreateWebpackConfig', actions, stage === 'develop', args, config)
}
