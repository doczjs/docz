import * as React from 'react'
import { Component } from 'react'
import { createContext } from 'react'
import equal from 'fast-deep-equal'

export interface ProviderProps<T> {
  initial?: T
}

export type PrevState<T> = (prevState: T) => T
export type GetFn<T> = (state: T) => React.ReactNode
export type Dispatch<T> = T | PrevState<T>

export interface State<T> {
  context: React.Context<T>
  set: (param: Dispatch<T>) => void
  Provider: React.ComponentType<ProviderProps<T>>
}

export function create<T = any>(initial: T): State<T> {
  const ctx = createContext<T>(initial)
  const listeners = new Set()

  const dispatch = (fn: Dispatch<T>) => {
    listeners.forEach((listener: any) => listener(fn))
  }

  return {
    context: ctx,
    set: fn => dispatch(fn),
    Provider: class Provider extends Component<ProviderProps<T>, T> {
      public static displayName = 'DoczStateProvider'
      public static getDerivedStateFromProps(props: any, state: any): any {
        if (!equal(props.initial, state)) return props.initial
        return null
      }
      public state = this.props.initial || initial || ({} as T)
      public componentDidMount(): void {
        listeners.add((fn: Dispatch<T>) => this.setState(fn))
      }
      public componentWillUnmount(): void {
        listeners.clear()
      }
      public render(): React.ReactNode {
        return (
          <ctx.Provider value={this.state}>{this.props.children}</ctx.Provider>
        )
      }
    },
  }
}
