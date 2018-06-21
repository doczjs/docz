# docz-plugin-css

Docz plugin to parse css files inside your documents

![](https://cdn-std.dprcdn.net/files/acc_649651/4Q4QBN)

## Instalation

First of all, install plugin:

```bash
$ yarn add docz-plugin-css --dev
```

After that, use the plugin on your `doczrc.js`:

```js
// doczrc.js
import { css } from 'docz-plugin-css'

export default {
  plugins: [
    css({
      preprocessor: 'postcss',
      cssmodules: true,
      loaderOpts: {
        /* whatever your preprocessor loader accept */
      }
    })
  ]
}
```

### Choosing PostCSS, Sass, Less or Stylus

Do you can choose how preprocessor your bundler will use just by changing the `preprocessor` property at the plugin definition:

```js
// doczrc.js
import { css } from 'docz-plugin-css'

export default {
  plugins: [
    css({
      preprocessor: 'sass'
    })
  ]
}
```

### Multiple pre-processor

You can still use multiple pre-processor together in the same configuration:

```js
// doczrc.js
import { css } from 'docz-plugin-css'

export default {
  plugins: [
    css({ preprocessor: 'sass' }),
    css({ preprocessor: 'stylus' }),
  ]
}
```

## Api

### Params

#### `preprocessor`

- **Type:** `postcss | sass | less | stylus`
- **Default:** `postcss`

Use to define the preprocessor you want to use

#### `cssmodules`
- **Type:** `Boolean`
- **Default:** `false`

Use this option if you want to use css modules

#### `loaderOpts`
- **Type:** `{ [key:string]: any }`
- **Default:** `{}`

Custom options passed on pre-processor loader configuration

#### `cssOpts`
- **Type:** `{ [key:string]: any }`
- **Default:** `{}`

Custom options passed on [css-loader](https://github.com/webpack-contrib/css-loader) configuration
