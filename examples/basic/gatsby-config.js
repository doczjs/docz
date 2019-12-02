module.exports = {
  plugins: [
    'gatsby-theme-docz-title',
    {
      resolve: 'gatsby-plugin-compile-es6-packages',
      options: {
        modules: ['gatsby-theme-docz-title'],
      },
    },
  ],
}
