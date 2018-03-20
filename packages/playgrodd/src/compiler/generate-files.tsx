import * as React from 'react'
import { renderToString } from 'react-dom/server'

const Html = () => (
  <html>
    <head>
      <title>Playgrodd</title>
      <body>
        <div id="root" />
      </body>
    </head>
  </html>
)

export const generateHtml = () => renderToString(<Html />)

export const generateJs = () =>
  `import 'babel-polyfill'

  import * as React from 'react'
  import { render } from 'react-dom'
  import { App } from 'playgrodd-theme-default'

  render(
    <App />,
    document.querySelector('#root')
  )`
