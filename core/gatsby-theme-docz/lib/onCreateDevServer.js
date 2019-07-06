const { Plugin, parseConfig } = require('docz-core')

module.exports = async (params, opts = {}) => {
  const config = await parseConfig(opts)
  const run = Plugin.runPluginsMethod(config.plugins)
  const { stage } = params

  run('onCreateDevServer', params, stage === 'develop')
}
