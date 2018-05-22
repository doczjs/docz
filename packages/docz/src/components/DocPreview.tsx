import * as React from 'react'
import { SFC } from 'react'
import loadable from 'loadable-components'
import { Switch, Route } from 'react-router-dom'

import { dataContext } from '../theme'

export interface DocPreviewProps {
  components: {
    [key: string]: any
  }
}

export const DocPreview: SFC<DocPreviewProps> = ({ components }) => (
  <dataContext.Consumer>
    {({ imports, entries }) => (
      <Switch>
        {Object.keys(imports).map(path => {
          const entry = entries && entries[path]
          const asyncComponent = loadable(async () => {
            const { default: Component } = await imports[path]()
            return props => <Component {...props} components={components} />
          })

          return (
            entry && (
              <Route
                exact
                key={entry.id}
                path={entry.route}
                component={asyncComponent}
              />
            )
          )
        })}
      </Switch>
    )}
  </dataContext.Consumer>
)
