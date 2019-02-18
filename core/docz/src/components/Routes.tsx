import * as React from 'react'
import { SFC, useMemo, useContext, useEffect } from 'react'
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider'
import {
  LocationProvider,
  Router,
  createHistory,
  HistoryListenerParameter,
} from '@reach/router'

declare var DOCZ_BASE_URL: string

import { doczState } from '../state'
import { ComponentsMap } from './DocPreview'
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

export const Routes: SFC = withMDXComponents(
  ({ components, imports }: RoutesProps) => {
    const { entries } = useContext(doczState.context)
    if (!entries || !components) return null

    const NotFound: any = components.notFound
    const Loading: any = components.loading
    const history = useMemo(() => createHistory(window as any), [])

    useEffect(() => {
      history.listen(goToHash)
    }, [])

    return (
      <LocationProvider history={history}>
        <React.Suspense fallback={<Loading />}>
          <Router basepath={DOCZ_BASE_URL}>
            <NotFound default />
            {entries.map(({ key: path, value: entry }) => {
              const props = { path, entries, components }
              const component = loadRoute(path, imports, Loading)

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
    )
  }
)
