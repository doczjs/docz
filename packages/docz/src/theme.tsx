// tslint:disable
import * as React from 'react'
import { Fragment, SFC } from 'react'
import { ComponentType as CT } from 'react'
import { HashRouter, BrowserRouter } from 'react-router-dom'

import { state, ThemeConfig, TransformFn, ThemeProps } from './state'
import { ErrorBoundary } from './components/ErrorBoundary'
import { DataServer } from './components/DataServer'
import { ScrollToTop } from './utils/ScrollToTop'

declare var BASE_URL: string
export type ThemeReturn = (WrappedComponent: CT) => CT<ThemeProps>

const DefaultWrapper: SFC = ({ children }) => <Fragment>{children}</Fragment>

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
          <state.Provider initialState={{ ...props.db, ...themeState }}>
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
        </ErrorBoundary>
      )
    }

    Theme.displayName = 'DoczTheme'
    return Theme
  }
}
