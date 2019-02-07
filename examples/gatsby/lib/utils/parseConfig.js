const { parseConfig } = require('docz-core')
const { mockArgv } = require('./argv')

module.exports = async () => {
  return parseConfig(mockArgv)
}
