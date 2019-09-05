## Docz React Native

Use your React Native components inside docz

> We're using [react-native-web](https://github.com/necolas/react-native-web) to make this integration possible. So, maybe you can have some caveats.

## Installation

These packages are required to use React Native with docz:

```bash
$ yarn add react-native-web react-art
```

Then, just set the `--native` argument with docz script:

```bash
$ docz dev --native
$ docz build --native
```

Or you can set directly on your `doczrc.js`:

```js
export default {
  native: true
}
```

That's it 🙌🏻
