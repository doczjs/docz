# docz-theme-default

Default theme for [docz](https://docz.site)

![](https://cdn-std.dprcdn.net/files/acc_649651/rvJgRu)

## Dark Mode

To change your project to use a darker version of default theme, just set your `doczrc.js` like that:

```js
// doczrc.js
export default {
  themeConfig: {
    mode: 'dark'
  }
}
```

## Changing your logo

Use your own logo by changing the `logo` property:

```js
// doczrc.js
export default {
  themeConfig: {
    logo: {
      src: '/path/of/my/logo',
      width: 150
    }
  }
}
```

## Default `themeConfig`

As explained on [Customizing](https://www.docz.site/introduction/customizing) section of docz website, you can customize the theme that you're using by changing `themeConfig` property on your `doczrc.js`. So, each theme has your own specific configuration and for this theme, is that the default config and what you can change:

```js
const config = {
  /**
   * Mode
   */
  mode: 'light', // you can use: 'dark' or 'light'
  /**
   * Logo
   */
  logo: {
    src: null,
    width: null,
  },
  /**
   * Colors (depends on select mode)
   */
  colors: {
    white: '#FFFFFF',
    grayExtraLight: '#EEF1F5',
    grayLight: '#CED4DE',
    gray: '#7D899C',
    grayDark: '#2D3747',
    grayExtraDark: '#1D2330',
    dark: '#13161F',
    blue: '#0B5FFF',
    skyBlue: '#1FB6FF',
    /** properties bellow depends on mode select */
    primary: colors.blue,
    text: colors.dark,
    link: colors.blue,
    footerText: colors.grayDark,
    sidebarBg: colors.grayExtraLight,
    sidebarText: colors.dark,
    background: colors.white,
    border: colors.grayLight,
    theadColor: colors.gray,
    theadBg: colors.grayExtraLight,
    tableColor: colors.dark,
    tooltipBg: colors.dark,
    tooltipColor: colors.grayExtraLight,
    codeBg: colors.grayExtraLight,
    codeColor: colors.gray,
    preBg: colors.grayExtraLight,
  },
  /**
   * Styles
   */
  styles: {
    body: {
      fontFamily: "'Source Sans Pro', Helvetica, sans-serif",
      fontSize: '16px',
      lineHeight: 1.5,
    },
    container: {
      width: 960,
      maxWidth: '100%',
      padding: ['20px 30px', '50px 50px 100px'],
    },
    h1: {
      margin: '30px 0',
      fontSize: [36, 48],
      fontWeight: 600,
    },
    h2: {
      margin: ['25px 0 20px', '50px 0 20px'],
      lineHeight: ['1.2em', '1.5em'],
      fontSize: [30, 32],
      fontWeight: 400,
    },
    h3: {
      margin: '30px 0 20px',
      fontSize: [22, 24],
      fontWeight: 400,
    },
    h4: {
      fontSize: 20,
      fontWeight: 400,
    },
    h5: {
      fontSize: 18,
      fontWeight: 400,
    },
    h6: {
      fontSize: 16,
      fontWeight: 400,
    },
    list: {
      padding: 0,
      margin: '10px 0 10px 20px',
    },
    playground: {
      padding: ['1.5em', '2em'],
    },
    code: {
      margin: '0 3px',
      padding: '4px 6px',
      borderRadius: '3px',
      fontFamily: "'Inconsolata', monospace",
      fontSize: 16,
    },
    pre: {
      padding: ['1.5em', '2em'],
      fontFamily: "'Inconsolata', monospace",
      fontSize: 16,
    },
    table: {
      fontFamily: "'Inconsolata', monospace",
      fontSize: 16,
    },
  }
}
```
