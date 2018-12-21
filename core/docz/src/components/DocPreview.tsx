import * as React from 'react'
import { Fragment, SFC, ComponentType as CT } from 'react'
import { Switch, Route, RouteComponentProps } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/tag'
import { get } from 'lodash/fp'

import { AsyncRoute, loadRoute } from './AsyncRoute'
import { state, Entry } from '../state'

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

  return (
    <MDXProvider components={components}>
      {state.get(({ entries }) => {
        if (!entries) return null
        return (
          <Switch>
            {Object.keys(entries).map(path => {
              const entry = get(path, entries)
              const props = { path, entries, components }
              const component: any = loadRoute(path, components.loading)

              component.preload()
              return (
                <Route
                  exact
                  key={entry.id}
                  path={entry.route}
                  render={routeProps => (
                    <AsyncRoute
                      {...routeProps}
                      {...props}
                      asyncComponent={component}
                    />
                  )}
                />
              )
            })}
            {NotFound && <Route component={NotFound} />}
          </Switch>
        )
      })}
    </MDXProvider>
  )
}
