import * as React from 'react'
import { SFC } from 'react'
import { Subscribe } from 'unstated'
import { Switch, Route } from 'react-router-dom'

import { PreviewProps, Doc } from '../../'
import { DocsContainer } from '../DocsContainer'
import { isFn } from '../utils/helpers'

export const Preview: SFC<PreviewProps> = ({ children }) => (
  <Subscribe to={[DocsContainer]}>
    {({ state }) => {
      const docs: Doc[] = Array.from(state.docs.values())

      return (
        <Switch>
          {docs &&
            docs.length > 0 &&
            docs.map(doc => {
              const docObj = doc.toObject()

              return (
                <Route
                  exact
                  key={docObj.id}
                  path={docObj.route}
                  render={() => isFn(children) && children(docObj)}
                />
              )
            })}
        </Switch>
      )
    }}
  </Subscribe>
)
