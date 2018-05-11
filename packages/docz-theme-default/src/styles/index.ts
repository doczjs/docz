import { css, injectGlobal } from 'emotion'

import * as colors from './colors'

const selection = css`
  background: ${colors.linkColor};
  color: white;
`

// tslint:disable
injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Fira+Mono');
  @import url('https://fonts.googleapis.com/css?family=Open+Sans:100,300,400,600,700');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css');

  *, *:before, *:after {
    box-sizing: border-box;
  }

  ::-moz-selection {
    ${selection}
  }
  ::selection {
    ${selection}
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    line-height: 1.5;
    background: ${colors.background};
    overflow: hidden;
  }

  body {
    color: transparent;
  }

  body > *, #root {
    color: ${colors.textColor};
  }

  html, body, #root {
    height: 100vh;
    min-height: 100vh;
  }

  a, a:visited, a:active {
    text-decoration: none;
    color: ${colors.linkColor};
  }

  a:hover {
    color: ${colors.linkColor};
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
    color: ${colors.textColor};
  }

  code, pre {
    font-family: 'Fira Mono', monospace;
  }
`
