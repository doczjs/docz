import * as fs from 'fs-extra'
import { isFunction } from 'lodash/fp'

import * as paths from '../config/paths'

export interface Params {
  state: Record<string, any>
  setState: (key: string, val: any) => void
}

export interface State {
  id: string
  start: (params: Params) => Promise<void>
  close: () => void
}

export interface Action {
  type: string
  payload: any
}

export type Listener = (action: Action) => void

export class DataServer {
  private states: Set<State>
  private state: Map<string, any>
  private listeners: Set<Listener>

  constructor() {
    this.states = new Set()
    this.state = new Map()
    this.listeners = new Set<Listener>()
  }

  public register(states: State[]): DataServer {
    for (const state of states) this.states.add(state)
    return this
  }

  public async start(): Promise<void> {
    const setState = (key: string, val: any) => this.setState(key, val)

    await Promise.all(
      Array.from(this.states).map(async state => {
        if (!isFunction(state.start)) return
        return state.start({
          setState,
          state: this.mapToObject(this.state),
        })
      })
    )
  }

  public close(): void {
    for (const state of this.states) {
      isFunction(state.close) && state.close()
    }
  }

  public onStateChange(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.clear()
  }

  private setState(key: string, val: any): void {
    this.state.set(key, val)
    this.writeDbFile()
    this.listeners.forEach(listener => {
      listener({ type: `state.${key}`, payload: val })
    })
  }

  private async writeDbFile(): Promise<void> {
    fs.outputJSONSync(paths.db, this.mapToObject(this.state), { spaces: 2 })
  }

  private mapToObject<T>(map: Map<string, any>): T {
    return Array.from(map.entries()).reduce(
      (obj, [key, val]) => ({ ...obj, [key]: val }),
      {} as T
    )
  }
}
