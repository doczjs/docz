import * as React from 'react'
import { Fragment, Component, ComponentType as CT } from 'react'
import equal from 'fast-deep-equal'

import { state, Database, ThemeConfig, TransformFn } from './state'
import { DataServer } from './components/DataServer'

declare var DOCZ_WEBSOCKET_URL: string

interface ThemeProps {
  wrapper?: CT
  hashRouter?: boolean
  websocketUrl?: string
  db: Database
  children(WrappedComponent: CT): JSX.Element
}

export type ThemeReturn = (WrappedComponent: CT) => CT<ThemeProps>

export function theme(
  themeConfig: ThemeConfig,
  transform: TransformFn = c => c
): ThemeReturn {
  return WrappedComponent => {
    class Theme extends Component<ThemeProps> {
      public static displayName = WrappedComponent.displayName || 'DoczTheme'

      public shouldComponentUpdate(nextProps: ThemeProps): boolean {
        return !equal(nextProps.db, this.props.db)
      }

      public render(): React.ReactNode {
        const { db, wrapper: Wrapper = Fragment, children } = this.props
        return (
          <state.Provider initial={{ ...db, themeConfig, transform }}>
            <DataServer websocketUrl={DOCZ_WEBSOCKET_URL}>
              <Wrapper>
                <WrappedComponent>{children}</WrappedComponent>
              </Wrapper>
            </DataServer>
          </state.Provider>
        )
      }
    }

    return Theme
  }
}
