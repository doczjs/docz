import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { JSDOM, DOMWindow } from 'jsdom'
import { State } from '../states'
import { Config } from '../commands/args'
import { renderStylesToString } from 'emotion-server'
import { StaticRouter } from 'react-router-dom'

export interface Global {
  [key: string]: any
  window: DOMWindow
}

declare var global: Global

const dom = new JSDOM()
global.document = dom.window.document
global.window = dom.window

global.navigator = {
  userAgent: 'node',
}

export interface PrerenderEntries {
  [key: string]: string
}

export default function prerender(
  state: State,
  config: Config
): PrerenderEntries {
  const imports = Object.values(state.entries!).reduce((acc, entry) => {
    acc[entry.filepath] = () => require(entry.filepath).default
    return acc
  }, {})

  const Theme = require(config.theme).default
  return Object.keys(state.entries!).reduce(
    (acc, path) => {
      const entry = state.entries![path]
      const Root = () => (
        <StaticRouter location={entry.route}>
          <Theme db={state} imports={imports} hashRouter={false} />
        </StaticRouter>
      )

      acc[entry.route] = renderStylesToString(renderToString(<Root />))
      return acc
    },
    {} as any
  )
}
