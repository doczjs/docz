import * as React from 'react'
import { Fragment, SFC, ComponentType as CT } from 'react'
import { doczState, Database, ThemeConfig, TransformFn } from './state'

export interface ThemeProps {
  db: Database
  wrapper?: CT
  linkComponent?: CT
  children(WrappedComponent: CT): JSX.Element
}

export type ThemeReturn = (WrappedComponent: CT) => CT<ThemeProps>

export function theme(
  themeConfig: ThemeConfig,
  transform: TransformFn = c => c
): ThemeReturn {
  return WrappedComponent => {
    const Theme: SFC<ThemeProps> = React.memo(props => {
      const { linkComponent } = props
      const { db, children, wrapper: Wrapper = Fragment } = props
      const initial: any = { ...db, themeConfig, transform, linkComponent }

      return (
        <doczState.Provider initial={initial}>
          <Wrapper>
            <WrappedComponent>{children}</WrappedComponent>
          </Wrapper>
        </doczState.Provider>
      )
    })

    return Theme
  }
}
