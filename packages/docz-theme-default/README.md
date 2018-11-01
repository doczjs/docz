# docz-theme-default

Default theme for [docz](https://docz.site)

![](https://cdn-std.dprcdn.net/files/acc_649651/xZt5zr)

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

## Changing playground theme

If you want to customize `<Playground>` theme, you just need to import the css of your [codemirror theme](https://codemirror.net/theme/) and change the `codemirrorTheme` to use your theme. One of ways to import a new css without pain, is add new link on `htmlContext`:

```js
// doczrc.js
export default {
  htmlContext: {
    head: {
      links: [{
        rel: 'stylesheet',
        href: 'https://codemirror.net/theme/dracula.css'
      }]
    }
  },
  themeConfig: {
    codemirrorTheme: 'dracula'
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
   * Show/hide Playground editor by default
   */
  showPlaygroundEditor: true,
  /**
   * Customize codemirror theme
   */
  codemirrorTheme: 'docz-light',
  /**
   * Logo
   */
  logo: {
    src: null,
    width: null,
  },
  /**
   * Radius
   */
  radii: '4px',
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
    text: colors.grayDark,
    link: colors.blue,
    footerText: colors.grayDark,
    sidebarBg: colors.grayExtraLight,
    sidebarText: colors.dark,
    sidebarHighlight: null,
    sidebarBorder: colors.grayLight,
    background: colors.white,
    border: colors.grayLight,
    theadColor: colors.gray,
    theadBg: colors.grayExtraLight,
    tableColor: colors.dark,
    codeBg: lighten(0.02, colors.grayExtraLight),
    codeColor: colors.gray,
    preBg: colors.grayExtraLight,
    blockquoteBg: colors.grayExtraLight,
    blockquoteBorder: colors.grayLight,
    blockquoteColor: colors.gray,
  },
  /**
   * Styles
   */
  styles: {
    body: {
      fontFamily: "'Source Sans Pro', Helvetica, sans-serif",
      fontSize: 16,
      lineHeight: 1.6,
    },
    container: {
      width: ['100%', '100%', 920],
      padding: ['20px', '0 40px 40px'],
    },
    h1: {
      margin: ['30px 0 20px', '60px 0 20px', '40px 0'],
      fontSize: [36, 42, 48],
      fontWeight: 100,
      letterSpacing: '-0.02em',
    },
    h2: {
      margin: ['20px 0 20px', '35px 0 20px'],
      lineHeight: ['1.2em', '1.5em'],
      fontSize: 28,
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h3: {
      margin: '25px 0 10px',
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
      fontFamily: '"Source Code Pro", monospace',
      fontSize: '0.85em',
    },
    pre: {
      fontFamily: '"Source Code Pro", monospace',
      fontSize: 14,
      lineHeight: 1.8,
    },
    paragraph: {
      margin: '10px 0 30px',
    },
    table: {
      overflowY: 'hidden',
      overflowX: ['initial', 'initial', 'initial', 'hidden'],
      display: ['block', 'block', 'block', 'table'],
      width: '100%',
      marginBottom: [20, 40],
      fontFamily: '"Source Code Pro", monospace',
      fontSize: 14,
    },
    blockquote: {
      margin: '25px 0',
      padding: '20px',
      fontStyle: 'italic',
      fontSize: 18,
    },
  }
}
```
