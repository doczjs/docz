# docz-plugin-babel6

By default and by some performance issues, Docz use Babel@7. If you want to use older versions of babel import this plugin and use on your `doczrc.js`:

```js
import { babel6 } from 'docz-plugin-babel6'

export default {
  plugins: [babel6()]
}
```
