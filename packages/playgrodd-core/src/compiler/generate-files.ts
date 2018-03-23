export const generateHtml = () => `
  <html>
    <head>
      <title>Playgrodd</title>
      <body>
        <div id="root" />
      </body>
    </head>
  </html>
`

export const generateJs = () =>
  `import 'babel-polyfill'

  import * as React from 'react'
  import { render } from 'react-dom'
  import { Theme } from 'playgrodd-theme-default'

  render(
    <Theme />,
    document.querySelector('#root')
  )`
