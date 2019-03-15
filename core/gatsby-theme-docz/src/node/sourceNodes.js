const crypto = require('crypto')
const fs = require('fs-extra')
const { Entries, DataServer, states } = require('docz-core')
const { parseConfig } = require('../utils/parseConfig')

const digest = str =>
  crypto
    .createHash('md5')
    .update(str)
    .digest('hex')

module.exports = async ({ actions, createNodeId }, opts) => {
  const { createNode } = actions
  const config = await parseConfig(opts)
  const entries = new Entries(config)
  const dataServer = new DataServer()

  if (config.propsParser) dataServer.register([states.props(config)])
  dataServer.register([states.config(config), states.entries(entries, config)])

  try {
    await dataServer.start()
  } catch (err) {
    console.error('Failed to process data server')
    console.error(err)
    dataServer.close()
    process.exit(1)
  }

  const createDbNode = async () => {
    const db = await fs.readJSON(config.paths.db)
    const contentDigest = digest(JSON.stringify(db))

    createNode({
      id: createNodeId('docz-db'),
      db: JSON.stringify(db),
      children: [],
      internal: {
        contentDigest,
        type: 'DoczDb',
      },
    })
  }

  const createEntriesNode = async () => {
    const map = await entries.get()
    const contentDigest = digest(JSON.stringify(map))
    const values = Object.entries(map)

    values.forEach(([key, entry]) => {
      createNode({
        ...entry,
        children: [],
        internal: {
          contentDigest,
          type: 'DoczEntries',
        },
      })
    })
  }

  const createNodes = async () => {
    await createDbNode()
    await createEntriesNode()
  }

  await createNodes()
  dataServer.onStateChange(async () => createNodes())
}
