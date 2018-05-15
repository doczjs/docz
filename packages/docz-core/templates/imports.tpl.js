export const imports = {
  <% entries.forEach(function(entry) { %>'<%- entry.filepath %>': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "<%- entry.slug %>" */ '<%- entry.filepath %>'),<% }) %>
}
