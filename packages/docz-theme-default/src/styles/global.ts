import { injectGlobal } from 'emotion'

// tslint:disable
injectGlobal`
  @import url('https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css');

  *, *:before, *:after {
    box-sizing: border-box;
  }

  .icon-link {
    display: none;
  }

  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  html, body, #root {
    height: 100vh;
    min-height: 100vh;
  }
`
