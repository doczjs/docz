import * as React from 'react'
import { SFC } from 'react'
import loadable from 'loadable-components'
import { Switch, Route, RouteComponentProps } from 'react-router-dom'

import { dataContext, Entry } from '../theme'
import { RenderComponent } from './Playground'

export type PageProps = RouteComponentProps<any> & {
  doc?: Entry
}

export interface ComponentsMap {
  page?: React.ComponentType<PageProps>
  render?: RenderComponent
  h1?: React.ComponentType<any>
  h2?: React.ComponentType<any>
  h3?: React.ComponentType<any>
  h4?: React.ComponentType<any>
  h5?: React.ComponentType<any>
  h6?: React.ComponentType<any>
  ul?: React.ComponentType<any>
  table?: React.ComponentType<any>
  pre?: React.ComponentType<any>
  [key: string]: any
}

export interface DocPreviewProps {
  components: ComponentsMap
}

export const DocPreview: SFC<DocPreviewProps> = ({ components }) => {
  const Page = components.page

  return (
    <dataContext.Consumer>
      {({ imports, entries }) => (
        <Switch>
          {Object.keys(imports).map(path => {
            const entry = entries && entries[path]
            const AsyncComponent = loadable(async () => {
              const { default: Component } = await imports[path]()
              return props => <Component {...props} components={components} />
            })

            return (
              entry && (
                <Route
                  exact
                  key={entry.id}
                  path={entry.route}
                  render={props =>
                    Page ? (
                      <Page {...props} doc={entry}>
                        <AsyncComponent />
                      </Page>
                    ) : (
                      <AsyncComponent {...props} />
                    )
                  }
                />
              )
            )
          })}
        </Switch>
      )}
    </dataContext.Consumer>
  )
}
