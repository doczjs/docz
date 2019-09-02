const path = require('path')
const get = require('lodash/get')

const NO_OP = () => {}

let gatsbyNodeCustom
try {
  gatsbyNodeCustom = require('./gatsby-node.custom')
} catch (err) {
  gatsbyNodeCustom = {
    onCreateWebpackConfig: NO_OP,
  }
}

exports.onCreateWebpackConfig = args => {
  args.actions.setWebpackConfig({
    resolve: {
      alias: {
        react: path.resolve('../node_modules/react'),
      },
    },
  })
  const onCreateWebpackConfig = get(
    gatsbyNodeCustom,
    'onCreateWebpackConfig',
    NO_OP
  )
  onCreateWebpackConfig(args)
}
