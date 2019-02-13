import * as React from 'react'
import { Fragment, SFC } from 'react'
import { Switch, Route } from 'react-router-dom'
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider'

import { state } from '../state'
import { AsyncRoute, loadRoute, Imports } from './AsyncRoute'
import { ComponentsMap } from './DocPreview'

export interface RoutesProps {
  components: ComponentsMap
  imports: Imports
}

export const Routes: SFC = withMDXComponents(
  ({ components, imports }: RoutesProps) => (
    <Fragment>
      {state.get(({ entries }) => {
        if (!entries || !components) return null

        const NotFound: any = components.notFound
        const Loading: any = components.loading

        return (
          <Switch>
            {entries.map(({ key: path, value: entry }) => {
              const props = { path, entries, components }
              const component: any = loadRoute(path, imports, Loading)

              component.preload()
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
        )
      })}
    </Fragment>
  )
)
