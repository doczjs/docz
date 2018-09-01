# ⚠️ DEPRECATED ⚠️
#### THIS PLUGINS WAS DEPRECATED IN FAVOR OF BABEL 7 RELEASE

Since Babel 7 now is a reality, we deprecated support for older versions of it. We indicate that you update your babel version. You can do that just by running [babel-upgrade](https://github.com/babel/babel-upgrade):

```bash
npx babel-upgrade --write
```

# docz-plugin-babel6

By default and some performance issues, Docz use Babel@7. If you want to use older versions of babel import this plugin and use on your `doczrc.js`:

```js
import { babel } from 'docz-plugin-babel6'

export default {
  plugins: [babel()]
}
```
