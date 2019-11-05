exports.onCreateWebpackConfig = ({ plugins, actions }) => {
  const { setWebpackConfig } = actions

  setWebpackConfig({
    plugins: [
      plugins.define({
        'process.env.FOO': JSON.stringify('BAR'),
        'process.env.PROD': JSON.stringify(true),
      }),
    ],
  })
}
