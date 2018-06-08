import * as React from 'react'
import { SFC } from 'react'
import loadable from 'loadable-components'
import { Switch, Route, RouteComponentProps } from 'react-router-dom'

import { dataContext, Entry, ImportMap } from '../theme'
import { RenderComponent } from './Playground'

export type PageProps = RouteComponentProps<any> & {
  doc?: Entry
}

export interface ComponentsMap {
  loading?: React.ComponentType
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

const DefaultLoading: SFC = () => null

const loadImport = (imports: ImportMap, components: ComponentsMap) => (
  path: string
) => async () => {
  const { default: Component } = await imports[path]()
  return (props: any) => <Component {...props} components={components} />
}

export interface DocPreviewProps {
  components: ComponentsMap
}

export const DocPreview: SFC<DocPreviewProps> = ({ components = {} }) => {
  const Page = components.page
  const LoadingComponent = components.loading || DefaultLoading

  return (
    <dataContext.Consumer>
      {({ imports, entries }) => (
        <Switch>
          {Object.keys(imports).map(path => {
            const entry = entries && entries[path]
            const load = loadImport(imports, components)
            const AsyncComponent = loadable(load(path), {
              LoadingComponent,
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
