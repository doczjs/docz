# docz-theme-default

Default theme for [docz](https://docz.site)

![](https://cdn-std.dprcdn.net/files/acc_649651/xZt5zr)

## Dark Mode

To change your project to use a darker version of default theme, just set your `doczrc.js` like that:

```js
// doczrc.js
export default {
  themeConfig: {
    mode: 'dark',
  },
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
      width: 150,
    },
  },
}
```

## Changing playground theme

If you want to customize `<Playground>` theme, you just need to import the css of your [codemirror theme](https://codemirror.net/theme/) and change the `codemirrorTheme` to use your theme. One of ways to import a new css without pain, is add new link on `htmlContext`:

```js
// doczrc.js
export default {
  htmlContext: {
    head: {
      links: [
        {
          rel: 'stylesheet',
          href: 'https://codemirror.net/theme/dracula.css',
        },
      ],
    },
  },
  themeConfig: {
    codemirrorTheme: 'dracula',
  },
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
   * Show/hide the LiveError overlay when errors are detected 
   */
  showLiveError: true,
  /**
   * Set the numbers of max lines before scroll editor
   */
  linesToScrollEditor: 14
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
    body: css`
      font-family: ${get('fonts.ui')};
      font-size: 16px;
      line-height: 1.6;
    `,
    h1: css`
      margin: 40px 0 20px;
      font-family: ${get('fonts.display')};
      font-size: 48px;
      font-weight: 500;
      letter-spacing: -0.02em;
    `,
    h2: css`
      margin: 30px 0 20px;
      line-height: 1.4em;
      font-family: ${get('fonts.display')};
      font-weight: 500;
      font-size: 28px;
      letter-spacing: -0.02em;
    `,
    h3: css`
      margin: 25px 0 10px;
      font-size: 20px;
      font-weight: 400;
    `,
    h4: css`
      margin: 25px 0 10px;
      font-size: 16px;
      font-weight: 400;
    `,
    h5: css`
      margin: 20px 0 10px;
      font-size: 16px;
      font-weight: 400;
    `,
    h6: css`
      margin: 20px 0 10px;
      font-size: 16px;
      font-weight: 400;
      text-transform: uppercase;
    `,
    ol: css`
      padding: 0;
      margin: 10px 0 10px;
    `,
    ul: css`
      padding: 0;
      margin: 10px 0 10px;
    `,
    playground: css`
      padding: 40px;
    `,
    code: css`
      margin: 0 3px;
      border-radius: 3px;
      font-family: ${get('fonts.mono')};
      padding: 2px 5px;
      font-size: 0.8em;
      border: '1px solid rgba(0, 0, 0, 0.02)';
    `,
    pre: css`
      font-family: ${get('fonts.mono')};
      font-size: 14px;
      line-height: 1.8;
    `,
    paragraph: css`
      margin: 10px 0 20px 0;
    `,
    table: css`
      overflow-y: hidden;
      width: 100%;
      font-family: ${get('fonts.mono')};
      font-size: 14px;
      overflow-x: initial;
      display: block;
    `,
    blockquote: css`
      margin: 25px 0;
      padding: 20px;
      font-style: italic;
      font-size: 16px;
    `,
  }
}
```
