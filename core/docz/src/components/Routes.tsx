import * as React from 'react'
import { SFC, useMemo, useContext, useEffect } from 'react'
import { MDXProvider } from '@mdx-js/tag'
import {
  LocationProvider,
  Router,
  createHistory,
  HistoryListenerParameter,
} from '@reach/router'

declare var DOCZ_BASE_URL: string

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
      const id: string = location.hash.substring(1)
      const el: HTMLElement | null = document.getElementById(id)
      if (el) el.scrollIntoView()
    }
  })
}

export const Routes: SFC<RoutesProps> = ({ imports }) => {
  const components = useComponents()
  const { entries } = useContext(doczState.context)
  if (!entries || !components) return null

  const NotFound: any = components.notFound
  const Loading: any = components.loading
  const history = useMemo(() => createHistory(window as any), [])

  useEffect(() => {
    history.listen(goToHash)
  }, [])

  return (
    <MDXProvider components={components}>
      <LocationProvider history={history}>
        <React.Suspense fallback={<Loading />}>
          <Router basepath={DOCZ_BASE_URL}>
            <NotFound default />
            {entries.map(({ key: path, value: entry }) => {
              const props = { path, entries, components }
              const component = loadRoute(path, imports)

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
        </React.Suspense>
      </LocationProvider>
    </MDXProvider>
  )
}
