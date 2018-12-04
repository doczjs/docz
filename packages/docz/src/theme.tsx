// tslint:disable
import * as React from 'react'
import { SFC, ComponentType as CT } from 'react'
import { HashRouter, BrowserRouter } from 'react-router-dom'

import { state, ThemeConfig, TransformFn } from './state'
import { ErrorBoundary } from './components/ErrorBoundary'
import { DataServer } from './components/DataServer'
import { ScrollToTop } from './utils/ScrollToTop'

// tslint:disable-next-line
import db from '~db'

declare var BASE_URL: string

interface ThemeProps {
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
      const { wrapper: Wrapper, hashRouter } = props
      const Router = (props: any) =>
        Boolean(hashRouter) ? (
          <HashRouter {...props} />
        ) : (
          <BrowserRouter {...props} />
        )

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
            <DataServer websocketUrl={props.websocketUrl}>
              <Router basename={BASE_URL}>
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
