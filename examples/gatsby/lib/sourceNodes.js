const crypto = require('crypto')
const fs = require('fs-extra')

const setupDataServer = require('./utils/setupDataServer')
const parseConfig = require('./utils/parseConfig')

const digest = str =>
  crypto
    .createHash('md5')
    .update(str)
    .digest('hex')

module.exports = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions
  const { paths } = await parseConfig()
  const dataServer = await setupDataServer()

  try {
    await dataServer.start()
  } catch (err) {
    console.error('Failed to process data server')
    console.error(err)
    dataServer.close()
    process.exit(1)
  }

  dataServer.onStateChange(async ({ type, payload }) => {
    const db = await fs.readJSON(paths.db)
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
  })
}
