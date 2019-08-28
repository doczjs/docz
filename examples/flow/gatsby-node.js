exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPreset({
    name: `@babel/preset-flow`,
  })
}
