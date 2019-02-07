const { Entries, DataServer, states } = require('docz-core')
const parseConfig = require('./parseConfig')

module.exports = async () => {
  const config = await parseConfig()
  const entries = new Entries(config)
  const dataServer = new DataServer()

  if (config.propsParser) dataServer.register([states.props(config)])
  dataServer.register([states.config(config), states.entries(entries, config)])
  return dataServer
}
