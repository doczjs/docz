import * as React from 'react'
import { SFC, useContext } from 'react'
import { Switch, Route } from 'react-router-dom'
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider'

import { doczState } from '../state'
import { ComponentsMap } from './DocPreview'
import { AsyncRoute, loadRoute, Imports } from './AsyncRoute'

export interface RoutesProps {
  components: ComponentsMap
  imports: Imports
}

export const Routes: SFC = withMDXComponents(
  ({ components, imports }: RoutesProps) => {
    const { entries } = useContext(doczState.context)
    if (!entries || !components) return null

    const NotFound: any = components.notFound
    const Loading: any = components.loading

    return (
      <React.Suspense fallback={<Loading />}>
        <Switch>
          {entries.map(({ key: path, value: entry }) => {
            const props = { path, entries, components }
            const component = loadRoute(path, imports, Loading)

            return (
              <Route
                exact
                key={entry.id}
                path={entry.route}
                render={routeProps => (
                  <AsyncRoute
                    {...routeProps}
                    {...props}
                    entry={entry}
                    asyncComponent={component}
                  />
                )}
              />
            )
          })}
          {NotFound && <Route component={NotFound} />}
        </Switch>
      </React.Suspense>
    )
  }
)
