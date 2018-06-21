# docz-plugin-css

Docz plugin to parse css files inside your documents

![](https://cdn-std.dprcdn.net/files/acc_649651/4Q4QBN)

## Examples

- [PostCSS](https://github.com/pedronauck/docz/tree/master/examples/css-postcss)
- [Less](https://github.com/pedronauck/docz/tree/master/examples/css-less)
- [Sass](https://github.com/pedronauck/docz/tree/master/examples/css-sass)
- [Stylus](https://github.com/pedronauck/docz/tree/master/examples/css-stylus)

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

## Using CSS Modules

To use css modules, just turn on `cssmodules` property on your project configuration:

```js
// doczrc.js
import { css } from 'docz-plugin-css'

export default {
  plugins: [
    css({
      preprocessor: 'sass',
      cssmodules: true
    })
  ]
}
```

After that, to import styles from css modules, just use `.module.{preprocessor-ext}` on your files

```markdown
---
name: Button
----

import { Playground } from 'docz'

import { Button } from './Button'
import { styles } from './styles.module.css'

# Button

Example of Button component with custom class!

<Playground>
  <Button className={styles.custom}>
    Click me
  </Button>
</Playground>
```

If you don't pass `.module` in front of the preprocessor extension, bundler will don't parse your css as cssmodule!

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
