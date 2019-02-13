import * as React from 'react'
import { Fragment, Component, ComponentType as CT } from 'react'
import equal from 'fast-deep-equal'

import { state, Database, ThemeConfig, TransformFn } from './state'
import { DataServer } from './components/DataServer'

interface ThemeProps {
  db: Database
  wrapper?: CT
  websocketUrl?: string
  linkComponent?: CT
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
        return !equal(nextProps, this.props)
      }

      public render(): React.ReactNode {
        const { linkComponent } = this.props
        const { db, children, wrapper: Wrapper = Fragment } = this.props
        const initial = { ...db, themeConfig, transform, linkComponent }

        return (
          <state.Provider initial={initial}>
            <DataServer websocketUrl={this.props.websocketUrl}>
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
