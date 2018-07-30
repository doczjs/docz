# docz-plugin-svgr

This plugin allow you to use [svgr](https://github.com/smooth-code/svgr/tree/master/packages/webpack) as loader for svg images together with default `file-loader`

## Install

```bash
$ yarn add docz-plugin-svgr
```

## Usage

Just import the plugin and add it on your `doczrc.js`

```js
import { svgr } from 'docz-plugin-svgr'

export default {
  plugins: [svgr()]
}
```

Then just use named imports to import using svgr

```jsx
import starUrl, { ReactComponent as Star } from './star.svg'

const App = () => (
  <div>
    <img src={starUrl} alt="star" />
    <Star />
  </div>
)
```

## Custom options

If you want to pass [custom options](https://github.com/smooth-code/svgr/tree/master/packages/webpack#passing-options) for `@svgr/webpack` just pass as first argument of the functio

```js
import { svgr } from 'docz-plugin-svgr'

export default {
  plugins: [svgr({ native: true })]
}
```
