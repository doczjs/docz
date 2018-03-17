import { IComponents } from './components'

const mapImports = (components: IComponents) =>
  Object.values(components).map(
    ({ name, filepath }) =>
      `window.__PLAYGRODD_COMPONENTS__.${name}.importFn = import('${filepath}')`
  )

export const generateMain = (components: IComponents) =>
  `import 'babel-polyfill'

  ${mapImports(components).join('\n')}

  import * as React from 'react'
  import { render } from 'react-dom'
  import { App } from 'playgrodd-theme-default'

  render(
    <App />,
    document.querySelector('#root')
  )`
