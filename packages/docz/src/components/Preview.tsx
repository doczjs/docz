import * as React from 'react'
import { SFC } from 'react'
import { Subscribe } from 'unstated'
import { Switch, Route } from 'react-router-dom'

import { PreviewProps, Doc } from '../../'
import { DocsContainer } from '../DocsContainer'

export const Preview: SFC<PreviewProps> = ({ children }) => (
  <Subscribe to={[DocsContainer]}>
    {({ state }) => {
      const docs: Doc[] = Array.from(state.docs.values())

      return (
        <Switch>
          {docs.length > 0 &&
            docs.map(doc => (
              <Route
                exact
                key={doc.id}
                path={doc.docRoute}
                render={() => children(doc)}
              />
            ))}
        </Switch>
      )
    }}
  </Subscribe>
)
