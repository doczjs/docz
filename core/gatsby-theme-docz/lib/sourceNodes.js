const crypto = require('crypto')
const fs = require('fs-extra')
const { Entries, DataServer, states } = require('docz-core')
const { parseConfig } = require('./utils/parseConfig')

const NODE_ENV = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV
const IS_DEV = NODE_ENV === 'development'

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

  if (config.propsParser) dataServer.register([states.props(config, IS_DEV)])
  dataServer.register([
    states.config(config, IS_DEV),
    states.entries(entries, config, IS_DEV),
  ])

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

  const createEntriesNodes = async () => {
    const map = await entries.get()
    const values = Object.entries(map)
    const contentDigest = digest(JSON.stringify(values))

    values.forEach(([, entry]) => {
      if (!entry) return null
      createNode({
        ...entry,
        children: [],
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
