const { mergeWith } = require('lodash/fp')
const fs = require('fs-extra')

let custom = {}
const hasGatsbyConfig = fs.existsSync('./gatsby-config.custom.js')

if (hasGatsbyConfig) {
  try {
    custom = require('./gatsby-config.custom')
  } catch (err) {
    console.error(
      `Failed to load your gatsby-config.js file : `,
      JSON.stringify(err)
    )
  }
}

const config = {
  <% if (config.base) {%>
  pathPrefix: "<%- config.base %>",
  <%}%>
  siteMetadata: {
    title: "<%- config.title %>",
    description: "<%- config.description %>"
  },
  plugins: [
    <% if (config.typescript) {%>
    {
      resolve: 'gatsby-plugin-typescript',
      options: {
        isTSX: true,
        allExtensions: true
      }
    },<%}%>
    {
      resolve: 'gatsby-theme-docz',
      options: <%- opts %>
    },<% if (isDoczRepo) {%>
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

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
