// tslint:disable
import * as React from 'react'
import { Fragment, SFC, ComponentType as CT } from 'react'
import { HashRouter, BrowserRouter } from 'react-router-dom'

import { state, State, ThemeConfig, TransformFn } from './state'
import { ErrorBoundary } from './components/ErrorBoundary'
import { DataServer } from './components/DataServer'
import { ScrollToTop } from './utils/ScrollToTop'

declare var BASE_URL: string
const DefaultWrapper: SFC = ({ children }) => <Fragment>{children}</Fragment>

interface ThemeProps {
  db: State
  wrapper?: CT
  hashRouter?: boolean
  websocketUrl?: string
  children(WrappedComponent: CT): JSX.Element
}

export type ThemeReturn = (WrappedComponent: CT) => CT<ThemeProps>

export function theme(
  themeConfig: ThemeConfig,
  transform: TransformFn = c => c
): ThemeReturn {
  return WrappedComponent => {
    const Theme: SFC<ThemeProps> = props => {
      const { wrapper: Wrapper = DefaultWrapper, hashRouter } = props
      const Router = Boolean(hashRouter) ? HashRouter : BrowserRouter

      return (
        <ErrorBoundary>
          <state.Provider initial={{ ...props.db, themeConfig, transform }}>
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

    return Theme
  }
}
