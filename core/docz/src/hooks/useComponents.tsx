import * as React from 'react'
import { useContext, createContext } from 'react'
import { Fragment, SFC, ComponentType as CT } from 'react'

import { Entry } from '../state'

export interface PlaygroundProps {
  className?: string
  style?: any
  wrapper?: CT<any>
  components: ComponentsMap
  component: JSX.Element
  position: number
  code: string
  scope: Record<string, any>
}

export interface LayoutProps {
  doc: Entry
  [key: string]: any
}

export interface ComponentsMap {
  notFound?: CT
  layout?: CT<LayoutProps>
  playground?: CT<PlaygroundProps>
  [key: string]: any
}

const DefNotFound: SFC = () => <Fragment>Not found</Fragment>
const DefLayout: SFC = ({ children }) => <Fragment>{children}</Fragment>
const DefPlayground: SFC<PlaygroundProps> = ({ component, code }) => (
  <div>
    {component}
    <pre>{code}</pre>
  </div>
)

const defaultComponents: ComponentsMap = {
  layout: DefLayout,
  notFound: DefNotFound,
  playground: DefPlayground,
}

export interface ComponentsProviderProps {
  components: ComponentsMap
}

const ctx = createContext<ComponentsMap>(defaultComponents)
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
