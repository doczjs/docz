export const imports = {
  <% entries.forEach(entry => { %>'<%- entry.filepath %>': import('<%- entry.filepath %>'),<% }) %>
}
