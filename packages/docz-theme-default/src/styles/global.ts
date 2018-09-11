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
  }

  .with-overlay {
    overflow: hidden;
  }

  html, body, #root {
    height: 100%;
    min-height: 100%;
  }
`
