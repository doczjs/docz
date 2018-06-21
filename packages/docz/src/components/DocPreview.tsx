import * as React from 'react'
import { Fragment, SFC, ComponentType } from 'react'
import { Switch, Route, RouteComponentProps } from 'react-router-dom'
import { ErrorBoundary } from './ErrorBoundary'
import { MDXProvider } from '@mdx-js/tag'
import loadable from 'loadable-components'

import { dataContext, Entry, ImportMap } from '../theme'

export type PageProps = RouteComponentProps<any> & {
  doc: Entry
}

const Identity: SFC<any> = ({ children }) => children
const DefaultLoading: SFC = () => null

export type RenderComponent = ComponentType<{
  component: JSX.Element
  code: any
}>

export const DefaultRender: RenderComponent = ({ component, code }) => (
  <Fragment>
    {component}
    {code}
  </Fragment>
)

const loadImport = (imports: ImportMap, components: ComponentsMap) => (
  path: string
) => async (): Promise<SFC<any>> => {
  const { default: Component } = await imports[path]()
  return props => <Component {...props} components={components} />
}

const defaultComponents: ComponentsMap = {
  loading: DefaultLoading,
  render: DefaultRender,
  page: Identity,
  notFound: Identity,
}

export interface ComponentsMap {
  loading?: ComponentType
  page?: ComponentType<PageProps>
  notFound?: ComponentType<RouteComponentProps<any>>
  render?: RenderComponent
  h1?: ComponentType<any> | string
  h2?: ComponentType<any> | string
  h3?: ComponentType<any> | string
  h4?: ComponentType<any> | string
  h5?: ComponentType<any> | string
  h6?: ComponentType<any> | string
  span?: ComponentType<any> | string
  a?: ComponentType<any> | string
  ul?: ComponentType<any> | string
  table?: ComponentType<any> | string
  pre?: ComponentType<any> | string
  code?: ComponentType<any> | string
  inlineCode?: ComponentType<any> | string
  [key: string]: any
}

export interface DocPreviewProps {
  components: ComponentsMap
}

export const DocPreview: SFC<DocPreviewProps> = ({
  components = defaultComponents,
}) => {
  const Page = components.page
  const NotFound = components.notFound
  const LoadingComponent = components.loading

  return (
    <ErrorBoundary>
      <MDXProvider components={components}>
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
              {NotFound && <Route component={NotFound} />}
            </Switch>
          )}
        </dataContext.Consumer>
      </MDXProvider>
    </ErrorBoundary>
  )
}
