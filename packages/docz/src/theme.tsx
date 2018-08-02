// tslint:disable
import * as React from 'react'
import { Fragment, SFC } from 'react'
import { ComponentType as CT } from 'react'
import { HashRouter, BrowserRouter } from 'react-router-dom'
import createContext from 'create-react-context'

import { ErrorBoundary } from './components/ErrorBoundary'
import { DataServer } from './components/DataServer'
import { state, Database, ThemeConfig, ImportMap } from './state'

declare var BASE_URL: any
const DefaultWrapper: SFC = ({ children }) => <Fragment>{children}</Fragment>

export interface ThemeProps {
  db: Database
  imports: ImportMap
  wrapper?: CT
  hashRouter?: boolean
  websocketUrl?: string
  children(WrappedComponent: CT): JSX.Element
}

export type ThemeReturn = (WrappedComponent: CT) => CT<ThemeProps>
export type TransformFn = (config: ThemeConfig) => ThemeConfig

interface ThemeContext {
  themeConfig?: ThemeConfig
  transform?: TransformFn
}

export const themeContext = createContext<ThemeContext>({})

export function theme(
  themeConfig: ThemeConfig,
  transform?: TransformFn
): ThemeReturn {
  return WrappedComponent => {
    const Theme: CT<ThemeProps> = props => {
      const { wrapper: Wrapper = DefaultWrapper, hashRouter = false } = props
      const Router = hashRouter ? HashRouter : BrowserRouter
      const initialState = {
        db: props.db,
        imports: props.imports,
      }

      return (
        <ErrorBoundary>
          <themeContext.Provider value={{ themeConfig, transform }}>
            <state.Provider initialState={initialState}>
              <DataServer websocketUrl={props.websocketUrl}>
                <Router basename={BASE_URL}>
                  <Wrapper>
                    <WrappedComponent />
                  </Wrapper>
                </Router>
              </DataServer>
            </state.Provider>
          </themeContext.Provider>
        </ErrorBoundary>
      )
    }

    Theme.displayName = 'DoczTheme'
    return Theme
  }
}
