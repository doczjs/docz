<% keys.forEach((key) => {%>exports.<%- key %> = params => {
  emitter.emit(<%- key %>, params)
}<%})%>
