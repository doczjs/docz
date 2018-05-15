export const imports = {
  <% Object.values(entries).forEach(function(entry) { %>'<%- entry.filepath %>': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "<%- entry.slug %>" */ '<%- entry.filepath %>'),<% }) %>
}
