# docz-plugin-babel6

By default and by some performance issues, Docz use Babel@7. If you want to using some older version of babel use this plugin:

Just import and use on your `doczrc.js`:

```js
import { babel } from 'docz-plugin-babel6'

export default {
  plugins: [babel6]
}
```
