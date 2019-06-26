const { getBaseConfig } = require('docz-core')

module.exports = ({ actions }, opts = {}) => {
  const config = getBaseConfig(opts)
  const { paths } = config

  actions.setBabelPlugin({
    name: 'babel-plugin-export-metadata',
    options: { root: paths.getRootDir(config) },
  })
}
