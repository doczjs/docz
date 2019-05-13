module.exports = {
  siteMetadata: {
    title: "<%- config.title %>",
    description: "<%- config.description %>"
  },
  __experimentalThemes: [
    { resolve: 'gatsby-theme-docz', options: <%- config %>}
  ],<% if (isDoczRepo) {%>
  plugins: [
    {
      resolve: 'gatsby-plugin-eslint',
      options: {
        test: /\.js$|\.jsx$/,
        exclude: /.*/,
        stages: ['develop'],
        options: {
          emitWarning: false,
          failOnError: false,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-compile-es6-packages',
      options: {
        modules: ['docz', 'docz-theme-default'],
      },
    },
  ],<%}%>
}
