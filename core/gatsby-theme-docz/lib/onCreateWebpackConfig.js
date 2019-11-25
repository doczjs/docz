const { Plugin, parseConfig } = require('docz-core')

module.exports = async (params, opts) => {
  const { stage, actions, getConfig } = params
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

  run('onCreateWebpackConfig', params, stage === 'develop', args, config)
}
