# docz-plugin-babel6

By default and some performance issues, Docz use Babel@7. If you want to use older versions of babel import this plugin and use on your `doczrc.js`:

```js
import { babel } from 'docz-plugin-babel6'

export default {
  plugins: [babel()]
}
```
