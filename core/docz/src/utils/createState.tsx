import * as React from 'react'
import { createContext, Component } from 'react'
import equal from 'fast-deep-equal'

export interface ProviderProps<T> {
  initial?: T
}

export type PrevState<T> = (prevState: T) => T
export type GetFn<T> = (state: T) => React.ReactNode
export type Dispatch<T> = T | PrevState<T>

export interface State<T> {
  get: (fn: GetFn<T>) => React.ReactNode
  set: (param: Dispatch<T>) => void
  Provider: React.ComponentType<ProviderProps<T>>
}

export function create<T = any>(initial: T = {} as T): State<T> {
  const { Provider, Consumer }: any = createContext<T>(initial)
  const listeners = new Set()

  Consumer.displayName = 'StateConsumer'

  const dispatch = (fn: Dispatch<T>) => {
    listeners.forEach(listener => listener(fn))
  }

  return {
    get: fn => <Consumer>{fn}</Consumer>,
    set: fn => dispatch(fn),
    Provider: class CustomProvider extends Component<ProviderProps<T>, T> {
      public static displayName = 'StateProvider'
      public state: T = this.props.initial || initial
      public componentDidMount(): void {
        listeners.add((fn: Dispatch<T>) => this.setState(fn))
      }
      public componentWillUnmount(): void {
        listeners.clear()
      }
      public shouldComponentUpdate(nextProps: any, nextState: any): boolean {
        return !equal(this.state, nextState)
      }
      public render(): React.ReactNode {
        return <Provider value={this.state}>{this.props.children}</Provider>
      }
    },
  }
}
