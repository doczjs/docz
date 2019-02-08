module.exports = {
  siteMetadata: {
    title: `Docz POC`,
    description: 'This is just an experiment to integrate Docz and Gatsby',
    author: 'Pedro Nauck',
  },
  /**
   * This is just what you need to get docz running inside Gatsby!
   */
  __experimentalThemes: [
    {
      resolve: 'gatsby-theme-docz',
    },
  ],
  /**
   * ## IMPORTANT ##
   * Do you shouldn't need this plugins
   * You need them just because of our monorepo
   * */
  plugins: [
    {
      resolve: 'gatsby-plugin-eslint',
      options: {
        test: /\.js$|\.jsx$/,
        exclude: /(node_modules|.cache|public|docz\/core\/docz)/,
        stages: ['develop'],
        options: {
          emitWarning: true,
          failOnError: false,
        },
      },
    },
  ],
}
