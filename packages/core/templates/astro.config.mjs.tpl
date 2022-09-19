import { createAstroConfig } from "docz/astro";
import baseConfig from './db.json'
<% if (configFilepath) {%>import doczConfig from '<%- configFilepath %>'<% } %>
export default createAstroConfig(baseConfig, <% if (configFilepath) { %>doczConfig<% } %>);
