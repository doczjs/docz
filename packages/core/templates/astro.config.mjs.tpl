import { createAstroConfig } from "docz/astro";
import db from './db.json'
<% if (configFilepath) {%>import doczConfig from '<%- configFilepath %>'<% } %>
export default createAstroConfig(db.config<% if (configFilepath) { %>, doczConfig<% } %>);
