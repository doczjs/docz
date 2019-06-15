module.exports = {
  siteMetadata: {
    title: "<%- config.title %>",
    description: "<%- config.description %>"
  },
  __experimentalThemes: [
    { resolve: 'gatsby-theme-docz', options: <%- config %>}
  ],
  plugins: [
    <% if (isDoczRepo) {%>
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
    <%}%>
    <% if (config.typescript) {%>
    {
      resolve: 'gatsby-plugin-typescript',
      options: {
        isTSX: true,
        allExtensions: true
      }
    }
    <%}%>
  ],
}
