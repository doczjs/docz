import { injectGlobal } from 'emotion'
import 'normalize.css'
import 'codemirror/lib/codemirror.css'

// tslint:disable
injectGlobal`
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
