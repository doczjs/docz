const path = require('path')
const { emitter } = require('docz-core')

exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  if (stage === 'develop') {
    actions.setWebpackConfig({
      resolve: {
        modules: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, '../../../node_modules'),
        ]
      }
    })
  }

  const config = getConfig()
  emitter.emit('onCreateWebpack', { actions, config })
  emitter.emit('onCreateWebpackChain', { actions, config })
}

<% keys.forEach((key) => {%>exports.<%- key %> = params => {
  emitter.emit(<%- key %>, params)
}<%})%>
