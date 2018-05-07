export const imports = {
  <% entries.forEach(entry => { %>'<%- entry.id %>': import('<%- entry.filepath %>'),<% }) %>
}
