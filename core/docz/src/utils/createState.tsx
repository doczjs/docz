import React, {
  createContext,
  Component,
  ReactNode,
  Context,
  ComponentType,
} from 'react'
import equal from 'fast-deep-equal'

export interface ProviderProps<T> {
  initial?: T
}

export type PrevState<T> = (prevState: T) => T
export type GetFn<T> = (state: T) => ReactNode
export type Dispatch<T> = T | PrevState<T>

export interface State<T> {
  context: Context<T>
  set: (param: Dispatch<T>) => void
  Provider: ComponentType<ProviderProps<T>>
}

export function create<T = any>(initial: T): State<T> {
  const ctx = createContext<T>(initial)
  const listeners = new Set<(fn: PrevState<T>) => void>()

  const dispatch = (fn: Dispatch<T>) => {
    listeners.forEach(listener => {
      if (typeof fn === 'function') {
        listener(fn as PrevState<T>)
      } else {
        listener(() => fn)
      }
    })
  }

  return {
    context: ctx,
    set: fn => dispatch(fn),
    Provider: class Provider extends Component<ProviderProps<T>, Readonly<T>> {
      public static displayName = 'DoczStateProvider'

      public static getDerivedStateFromProps(
        props: ProviderProps<T>,
        state: Readonly<T>
      ): Partial<T> | null {
        if (props.initial !== undefined && !equal(props.initial, state)) {
          return props.initial
        }
        return null
      }

      public state: Readonly<T> = this.props.initial || initial || ({} as T)

      public componentDidMount(): void {
        listeners.add((fn: PrevState<T>) => this.setState(fn))
      }

      public componentWillUnmount(): void {
        listeners.delete((fn: PrevState<T>) => this.setState(fn))
      }

      public render(): ReactNode {
        return (
          <ctx.Provider value={this.state}>{this.props.children}</ctx.Provider>
        )
      }
    },
  }
}
