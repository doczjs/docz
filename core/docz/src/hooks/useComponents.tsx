import React, { useContext, createContext } from 'react'
import { Fragment, FC, ComponentType as CT } from 'react'

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
  language?: string
  showLivePreview?: boolean
  useScoping?: boolean
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

const DefNotFound: FC = () => <Fragment>Not found</Fragment>
const DefLayout: FC = ({ children }) => <Fragment>{children}</Fragment>
const DefPlayground: FC<PlaygroundProps> = ({ component, code }) => (
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
export const ComponentsProvider: FC<ComponentsProviderProps> = ({
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
