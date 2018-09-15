// tslint:disable
import * as React from 'react'
import { Fragment, SFC } from 'react'
import { ComponentType as CT } from 'react'
import { HashRouter, BrowserRouter } from 'react-router-dom'
import createContext from 'create-react-context'

import { state, State, ThemeConfig, ImportMap } from './state'
import { ErrorBoundary } from './components/ErrorBoundary'
import { DataServer } from './components/DataServer'
import { ScrollToTop } from './utils/ScrollToTop'

declare var BASE_URL: string

const DefaultWrapper: SFC = ({ children }) => <Fragment>{children}</Fragment>

export interface ThemeProps {
  db: State
  imports: ImportMap
  wrapper?: CT
  hashRouter?: boolean
  websocketUrl?: string
  children(WrappedComponent: CT): JSX.Element
}

export type ThemeReturn = (WrappedComponent: CT) => CT<ThemeProps>
export type TransformFn = (config: ThemeConfig) => ThemeConfig

interface ThemeContext {
  imports?: ImportMap
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
      const themeState = { themeConfig, transform, imports: props.imports }

      return (
        <ErrorBoundary>
          <themeContext.Provider value={themeState}>
            <state.Provider initialState={props.db}>
              <DataServer websocketUrl={props.websocketUrl}>
                <Router basename={BASE_URL}>
                  <ScrollToTop>
                    <Wrapper>
                      <WrappedComponent />
                    </Wrapper>
                  </ScrollToTop>
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
