export const imports = {
  <% entries.forEach(entry => { %>'<%- entry.filepath %>': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "<%- entry.slug %>" */ '<%- entry.filepath %>'),<% }) %>
}
