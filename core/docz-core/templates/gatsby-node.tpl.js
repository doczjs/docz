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
  const onCreateWebpackConfig = get(
    gatsbyNodeCustom,
    'onCreateWebpackConfig',
    NO_OP
  )
  onCreateWebpackConfig(args)
}

exports.onCreateBabelConfig = args => {
  const onCreateBabelConfig = get(
    gatsbyNodeCustom,
    'onCreateBabelConfig',
    NO_OP
  )
  onCreateBabelConfig(args)
}
