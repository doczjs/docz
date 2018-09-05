// tslint:disable
import * as React from 'react'
import { Fragment, SFC } from 'react'
import { ComponentType as CT } from 'react'
import createContext from 'create-react-context'

import { ErrorBoundary } from './components/ErrorBoundary'
import { DataServer } from './components/DataServer'
import { state, State, ThemeConfig, ImportMap } from './state'

const DefaultWrapper: SFC = ({ children }) => <Fragment>{children}</Fragment>

export interface ThemeProps {
  db: State
  imports: ImportMap
  wrapper?: CT
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
      const { wrapper: Wrapper = DefaultWrapper } = props
      const themeState = { themeConfig, transform, imports: props.imports }

      return (
        <ErrorBoundary>
          <themeContext.Provider value={themeState}>
            <state.Provider initialState={props.db}>
              <DataServer websocketUrl={props.websocketUrl}>
                <Wrapper>
                  <WrappedComponent />
                </Wrapper>
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
