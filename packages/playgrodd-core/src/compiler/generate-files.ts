import { IEntryObj } from './files-parser'

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

const importEntry = (entry: IEntryObj) => `import '${entry.filepath}'`

export const generateApp = (entries: IEntryObj[]) =>
  `${entries.map(importEntry).join('\n')}

import React from 'react'
import { hot } from 'react-hot-loader'
import { Theme } from 'playgrodd-theme-default'

export const App = hot(module)(Theme)`

export const generateJs = () =>
  `import React from 'react'
import { render } from 'react-dom'
import { App } from './app'

render(
  <App />,
  document.querySelector('#root')
)`
