import * as React from 'react'
import { useContext, createContext } from 'react'
import { Fragment, SFC, ComponentType as CT } from 'react'
import { RouteComponentProps } from '@reach/router'

import { Entry } from '../state'

export type PageProps = RouteComponentProps<any> & {
  doc: Entry
}

export interface PlaygroundProps {
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

export type PlaygroundComponent = CT<PlaygroundProps>

export interface ComponentsMap {
  loading?: CT
  page?: CT<PageProps>
  notFound?: CT<RouteComponentProps<any>>
  playground?: PlaygroundComponent
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

export type NotFoundComponent = CT<RouteComponentProps<any>>

const DefaultNotFound: NotFoundComponent = () => <Fragment>Not found</Fragment>
const DefaultLoading: SFC = () => <Fragment>Loading</Fragment>
const DefaultPage: SFC<any> = ({ children }) => <Fragment>{children}</Fragment>
const DefaultPlayground: PlaygroundComponent = ({ component, code }) => (
  <Fragment>
    {component}
    {code}
  </Fragment>
)

const defaultComponents: ComponentsMap = {
  loading: DefaultLoading,
  playground: DefaultPlayground,
  notFound: DefaultNotFound,
  page: DefaultPage,
}

const ctx = createContext<ComponentsMap>({})

export interface ComponentsProviderProps {
  components: ComponentsMap
}

export const ComponentsProvider: SFC<ComponentsProviderProps> = ({
  components: themeComponents = {},
  children,
}) => (
  <ctx.Provider value={{ ...defaultComponents, ...themeComponents }}>
    {children}
  </ctx.Provider>
)

export const useComponents = (): ComponentsMap => {
  return useContext(ctx)
}
