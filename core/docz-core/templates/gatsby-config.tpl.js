const { merge } = require('lodash/fp')

let custom
try {
  custom = require('./gatsby-config.custom')
} catch(err) {
  custom = {}
}

const config = {
  siteMetadata: {
    title: "<%- config.title %>",
    description: "<%- config.description %>"
  },
  plugins: [
    {
      resolve: 'gatsby-theme-docz',
      options: <%- opts %>
    },<% if (config.typescript) {%>
    {
      resolve: 'gatsby-plugin-typescript',
      options: {
        isTSX: true,
        allExtensions: true
      }
    },<%}%><% if (isDoczRepo) {%>
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
        modules: ['docz', 'gatsby-theme-docz'],
      },
    },<%}%>
  ],
}

module.exports = merge(config, custom)
