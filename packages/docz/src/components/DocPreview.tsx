import * as React from 'react'
import { Fragment, SFC, ComponentType as CT } from 'react'
import { Switch, Route, RouteComponentProps } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/tag'
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider'
import Loadable from 'react-loadable'

import { state, State, Entry, EntryMap, ImportMap } from '../state'

export type PageProps = RouteComponentProps<any> & {
  doc: Entry
}

export interface RenderComponentProps {
  className?: string
  style?: any
  wrapper?: CT<any>
  components: ComponentsMap
  component: JSX.Element
  position: number
  code: string
}

export type RenderComponent = CT<RenderComponentProps>

export interface ComponentsMap {
  loading?: CT
  page?: CT<PageProps>
  notFound?: CT<RouteComponentProps<any>>
  render?: RenderComponent
  h1?: CT<any> | string
  h2?: CT<any> | string
  h3?: CT<any> | string
  h4?: CT<any> | string
  h5?: CT<any> | string
  h6?: CT<any> | string
  span?: CT<any> | string
  a?: CT<any> | string
  ul?: CT<any> | string
  table?: CT<any> | string
  pre?: CT<any> | string
  code?: CT<any> | string
  inlineCode?: CT<any> | string
  [key: string]: any
}

const DefaultLoading: SFC = () => <Fragment>Loading</Fragment>

export const Identity: SFC<any> = ({ children }) => (
  <Fragment>{children}</Fragment>
)

export const DefaultRender: RenderComponent = ({ component, code }) => (
  <Fragment>
    {component}
    {code}
  </Fragment>
)

export type NotFoundComponent = CT<RouteComponentProps<any>>
const DefaultNotFound: NotFoundComponent = () => <Fragment>Not found</Fragment>

const defaultComponents: ComponentsMap = {
  loading: DefaultLoading,
  render: DefaultRender,
  notFound: DefaultNotFound,
  page: Identity,
}

export const importsSelector = state.createSelector(
  (state: State) => state.imports
)

export const entriesSelector = state.createSelector(
  (state: State) => state.db.entries
)

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
      <state.Consumer select={[entriesSelector, importsSelector]}>
        {(entries: EntryMap, imports: ImportMap) => (
          <Switch>
            {Object.keys(imports).map(path => {
              const entry = entries && entries[path]
              const AsyncComponent: any = Loadable({
                loader: imports[path],
                loading: LoadingComponent,
                render(loaded: any, props): React.ReactNode {
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
      </state.Consumer>
    </MDXProvider>
  )
}
