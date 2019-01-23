const { DataServer, states } = require('docz-core')
const { pascalCase } = require('change-case')

const setupWatcher = require('./setupWatcher')

module.exports = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions
  const { entries, watcher, config } = await setupWatcher()
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

  const handleCreateNode = (type, key, value) => {
    const nodeId = createNodeId(`docz-${type}-${key}`)
    const nodeContent = JSON.stringify({ key, value })

    return Object.assign({}, value, {
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        content: nodeContent,
        type: `Docz${pascalCase(type)}`,
        contentDigest: createContentDigest(nodeContent),
      },
    })
  }

  dataServer.onStateChange(({ type, payload }) => {
    Object.entries(payload).forEach(([key, value]) => {
      const node = handleCreateNode(type.split('.')[1], key, value)
      createNode(node)
    })
  })
}
