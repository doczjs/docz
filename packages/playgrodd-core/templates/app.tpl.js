<% entries.forEach(function(entry) { %>import '<%- entry.filepath %>'
<% }); %>
import React from 'react'
import { hot } from 'react-hot-loader'
import { Theme } from 'playgrodd-theme-default'

export const App = hot(module)(Theme)
