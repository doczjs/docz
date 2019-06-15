const path = require('path')

exports.onCreateWebpackConfig = ({ stage, actions }) => {
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
}
