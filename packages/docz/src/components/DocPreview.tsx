import * as React from 'react'
import { Fragment, SFC, ComponentType as CT } from 'react'
import { Switch, Route, RouteComponentProps } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/tag'

import { state, State, Entry, EntryMap } from '../state'
import { themeContext } from '../theme'
import { AsyncRoute } from './AsyncRoute'

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
  codesandbox: string
  scope: Record<string, any>
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

export const entriesSelector = state.createSelector((s: State) => s.entries)

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

  const NotFound: any = components.notFound
  const LoadingComponent: any = components.loading

  return (
    <MDXProvider components={components}>
      <themeContext.Consumer>
        {({ imports }) => {
          if (!imports) return <LoadingComponent />
          return (
            <state.Consumer select={[entriesSelector]}>
              {(entries: EntryMap) => (
                <Switch>
                  {Object.keys(imports).map(path => {
                    const entry = entries[path]

                    return (
                      entry && (
                        <Route
                          exact
                          key={entry.id}
                          path={entry.route}
                          render={props => (
                            <AsyncRoute
                              {...props}
                              path={path}
                              entries={entries}
                              imports={imports}
                              components={components}
                            />
                          )}
                        />
                      )
                    )
                  })}
                  {NotFound && <Route component={NotFound} />}
                </Switch>
              )}
            </state.Consumer>
          )
        }}
      </themeContext.Consumer>
    </MDXProvider>
  )
}
