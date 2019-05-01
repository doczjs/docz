import * as React from 'react'
import { SFC, useMemo, useContext, useEffect } from 'react'
import { MDXProvider } from '@mdx-js/react'
import {
  LocationProvider,
  Router,
  createHistory,
  HistoryListenerParameter,
} from '@reach/router'

import { doczState } from '../state'
import { useComponents, ComponentsMap } from '../hooks/useComponents'
import { AsyncRoute, loadRoute, Imports } from './AsyncRoute'

export interface RoutesProps {
  components: ComponentsMap
  imports: Imports
}

const goToHash = ({ location }: HistoryListenerParameter) => {
  setTimeout(() => {
    if (location && location.hash) {
      const decodedHash = decodeURI(location.hash)
      const id: string = decodedHash.substring(1)
      const el: HTMLElement | null = document.getElementById(id)
      if (el) el.scrollIntoView()
    }
  })
}

export const Routes: SFC<RoutesProps> = ({ imports }) => {
  const components = useComponents()
  const { entries } = useContext(doczState.context)

  const NotFound: any = components.notFound
  const history = useMemo(() => createHistory(window as any), [])

  useEffect(() => {
    history.listen(goToHash)
  }, [])

  return (
    <MDXProvider components={components}>
      <LocationProvider history={history}>
        <Router>
          <NotFound default />
          {entries &&
            entries.map(({ key: path, value: entry }) => {
              const props = { path, entries, components }
              const component = loadRoute(path, imports, components)

              return (
                <AsyncRoute
                  {...props}
                  entry={entry}
                  key={entry.id}
                  path={entry.route}
                  asyncComponent={component}
                />
              )
            })}
        </Router>
      </LocationProvider>
    </MDXProvider>
  )
}
