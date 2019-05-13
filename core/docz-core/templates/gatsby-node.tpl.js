exports.onCreateWebpackConfig = ({ stage, actions }) => {
  if (stage === 'develop') {
    actions.setWebpackConfig({
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    })
  }
}
