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
    const db = await fs.readJSON(config.paths.db, { throws: false })
    const contentDigest = digest(JSON.stringify(db || {}))

    createNode({
      id: createNodeId('docz-db'),
      db: JSON.stringify(db || {}),
      children: [],
      internal: {
        contentDigest,
        type: 'DoczDb',
      },
    })
  }

  const createEntriesNodes = async payload => {
    const map = await entries.get()
    const values = Object.entries(map)

    values.forEach(([key, entry]) => {
      if (!entry) return null
      const contentDigest = digest(JSON.stringify(entry))
      createNode({
        ...entry,
        children: [],
        link: entry.link || false,
        menu: entry.menu || false,
        internal: {
          contentDigest,
          type: `DoczEntries`,
        },
      })
    })
  }

  const createNodes = async () => {
    await createDbNode()
    await createEntriesNodes()
  }

  await createNodes()
  dataServer.onStateChange(createNodes)
}
