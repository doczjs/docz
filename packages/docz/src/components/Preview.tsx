import * as React from 'react'
import { SFC } from 'react'
import { Subscribe } from 'unstated'
import { Switch, Route } from 'react-router-dom'

import { PreviewProps, DocObj } from '../../'
import { DocsContainer } from '../DocsContainer'
import { isFn } from '../utils/helpers'

export const Preview: SFC<PreviewProps> = ({ children }) => (
  <Subscribe to={[DocsContainer]}>
    {(container: DocsContainer) => {
      const docs: DocObj[] = container.docsObject()

      return (
        <Switch>
          {docs &&
            docs.length > 0 &&
            docs.map(doc => (
              <Route
                exact
                key={doc.id}
                path={doc.route}
                render={() => isFn(children) && children(doc)}
              />
            ))}
        </Switch>
      )
    }}
  </Subscribe>
)
