import * as React from 'react'
import { Fragment, SFC, ComponentType } from 'react'
import { Switch, Route, RouteComponentProps } from 'react-router-dom'
import { default as mdxtag } from '@mdx-js/tag'
import loadable from 'loadable-components'

import { dataContext, Entry, ImportMap } from '../theme'

export type PageProps = RouteComponentProps<any> & {
  doc: Entry
}

const Identity: SFC<any> = ({ children }) => <Fragment>{children}</Fragment>
const DefaultLoading: SFC = () => <Fragment>Loading</Fragment>

export type RenderComponent = ComponentType<{
  className?: string
  style?: any
  components: ComponentsMap
  component: JSX.Element
  code: (components: ComponentsMap) => any
  rawCode: string
}>

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

const loadImport = (imports: ImportMap, components: ComponentsMap) => (
  path: string
) => async (): Promise<SFC<any>> => {
  const { default: Component } = await imports[path]()
  return props => <Component {...props} components={components} />
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

  const Page = components.page
  const NotFound = components.notFound
  const LoadingComponent = components.loading

  return (
    <mdxtag.MDXProvider components={components}>
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
    </mdxtag.MDXProvider>
  )
}
