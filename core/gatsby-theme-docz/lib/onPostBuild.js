const { Plugin, parseConfig } = require('docz-core')

module.exports = async (params, opts = {}) => {
  const config = await parseConfig(opts)
  Plugin.runPluginsMethod(config.plugins)('onPreBuild')
}
