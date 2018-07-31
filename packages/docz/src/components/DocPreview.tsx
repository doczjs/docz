import * as React from 'react'
import { Fragment, SFC, ComponentType } from 'react'
import { Switch, Route, RouteComponentProps } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/tag'
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider'
import Loadable from 'react-loadable'

import { dataContext, Entry } from '../theme'

export type PageProps = RouteComponentProps<any> & {
  doc: Entry
}

export const Identity: SFC<any> = ({ children }) => (
  <Fragment>{children}</Fragment>
)

const DefaultLoading: SFC = () => <Fragment>Loading</Fragment>

export interface RenderComponentProps {
  className?: string
  style?: any
  wrapper?: ComponentType<any>
  components: ComponentsMap
  component: JSX.Element
  position: number
  code: string
}

export type RenderComponent = ComponentType<RenderComponentProps>

export const DefaultRender: RenderComponent = ({ component, code }) => (
  <Fragment>
    {component}
    {code}
  </Fragment>
)

export type NotFoundComponent = ComponentType<RouteComponentProps<any>>
const DefaultNotFound: NotFoundComponent = () => <Fragment>Not found</Fragment>

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

const defaultComponents: ComponentsMap = {
  loading: DefaultLoading,
  render: DefaultRender,
  notFound: DefaultNotFound,
  page: Identity,
}

export interface DocPreviewProps {
  components: ComponentsMap
}

export const DocPreview: SFC<DocPreviewProps> = ({
  components: themeComponents = {},
}) => {
  const components = {
    ...defaultComponents,
    ...themeComponents,
  }

  const Page: any = components.page
  const NotFound: any = components.notFound
  const LoadingComponent: any = components.loading

  return (
    <MDXProvider components={components}>
      <dataContext.Consumer>
        {({ imports, entries }) => (
          <Switch>
            {Object.keys(imports).map(path => {
              const entry = entries && entries[path]
              const AsyncComponent: any = Loadable({
                loader: imports[path],
                loading: LoadingComponent,
                render(loaded, props): React.ReactNode {
                  const Component = withMDXComponents(loaded.default)
                  return <Component {...props} doc={entry} />
                },
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
  )
}
