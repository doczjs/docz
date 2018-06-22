import { css, injectGlobal } from 'emotion'

const selection = (color: string) => css`
  background: ${color};
  color: white;
`

// tslint:disable
export const base = (config: any) => {
  injectGlobal`
    @import url('https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css');
    ${css(config.prismTheme)};

    *, *:before, *:after {
      box-sizing: border-box;
    }

    .icon-link {
      display: none;
    }

    ::-moz-selection {
      ${selection(config.colors.link)}
    }

    ::selection {
      ${selection(config.colors.link)}
    }

    body {
      margin: 0;
      padding: 0;
      font-family: ${config.styles.body.fontFamily};
      font-size: ${config.styles.body.fontSize};
      line-height: ${config.styles.body.lineHeight};
      background: ${config.colors.background};
      overflow: hidden;
    }

    body {
      color: transparent;
    }

    body > *, #root {
      color: ${config.colors.text};
    }

    html, body, #root {
      height: 100vh;
      min-height: 100vh;
    }

    a, a:visited, a:active {
      text-decoration: none;
      color: ${config.colors.link};
    }

    a:hover {
      color: ${config.colors.link};
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      transition: color 9999s ease-out, background-color 9999s ease-out;
      transition-delay: 9999s;
    }

    input:required,
    input:invalid {
      box-shadow: none;
    }

    button:focus {
      outline: none !important;
    }

    select {
      color: ${config.colors.text};
    }
  `
}
