import * as React from 'react'
import { SFC, ComponentType as CT } from 'react'
import { HashRouter, BrowserRouter } from 'react-router-dom'
import { StaticRouterProps } from 'react-router'

import { state, ThemeConfig, TransformFn } from './state'
import { ErrorBoundary } from './components/ErrorBoundary'
import { DataServer } from './components/DataServer'
import { ScrollToTop } from './utils/ScrollToTop'

// tslint:disable-next-line
import db from '~db'

declare var DOCZ_BASE_URL: string
declare var DOCZ_HASH_ROUTER: boolean
declare var DOCZ_WEBSOCKET_URL: string

interface ThemeProps {
  wrapper?: CT
  hashRouter?: boolean
  websocketUrl?: string
  children(WrappedComponent: CT): JSX.Element
}

export type ThemeReturn = (WrappedComponent: CT) => CT<ThemeProps>

const Router: SFC<StaticRouterProps> = (props: any) =>
  Boolean(DOCZ_HASH_ROUTER) ? (
    <HashRouter {...props} />
  ) : (
    <BrowserRouter {...props} />
  )

export function theme(
  themeConfig: ThemeConfig,
  transform: TransformFn = c => c
): ThemeReturn {
  return WrappedComponent => {
    const Theme: SFC<ThemeProps> = props => {
      const { wrapper: Wrapper } = props

      const wrapped = Wrapper ? (
        <Wrapper>
          <WrappedComponent />
        </Wrapper>
      ) : (
        <WrappedComponent />
      )

      return (
        <ErrorBoundary>
          <state.Provider initial={{ ...db, themeConfig, transform }}>
            <DataServer websocketUrl={DOCZ_WEBSOCKET_URL}>
              <Router basename={DOCZ_BASE_URL}>
                <ScrollToTop>{wrapped}</ScrollToTop>
              </Router>
            </DataServer>
          </state.Provider>
        </ErrorBoundary>
      )
    }

    return Theme
  }
}
