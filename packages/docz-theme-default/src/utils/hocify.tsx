import * as React from 'react'
import { ReactNode, ComponentType } from 'react'

type MapPropsFn<P, R> = (props: P) => Partial<R>
type RPComponent = ComponentType<{
  children: (renderProps: any) => ReactNode
}>

export function hocify<P, R, DP = {}>(
  Component: RPComponent,
  mapProps: MapPropsFn<P, R> = p => p
): (WrappedComponent: ComponentType<DP>) => ComponentType<DP & Partial<P>> {
  return WrappedComponent => props => (
    <Component>
      {renderProps => (
        <WrappedComponent {...props} {...mapProps(renderProps)} />
      )}
    </Component>
  )
}
