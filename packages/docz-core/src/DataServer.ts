import WS from 'ws'

import { touch } from './utils/fs'
import { isFn } from './utils/helpers'
import * as paths from './config/paths'

export type Send = (type: string, payload: any) => void
export type On = (type: string) => Promise<any>

const isSocketOpened = (socket: WS) => socket.readyState === WS.OPEN
const sender = (socket?: WS) => (type: string, payload: any) => {
  if (socket && isSocketOpened(socket)) {
    socket.send(JSON.stringify({ type, payload }))
  }
}

export interface Action {
  type: string
  payload: any
}

export interface Params {
  state: Record<string, any>
  setState: (key: string, val: any) => void
}

export interface State {
  init: (params: Params) => Promise<any>
  update: (params: Params) => any
}

export class DataServer {
  private server?: WS.Server
  private states: Set<State>
  private state: Map<string, any>

  constructor(server?: any, port?: number, host?: string) {
    this.states = new Set()
    this.state = new Map()

    if (server) {
      this.server = new WS.Server({ server, port, host })
    }
  }

  public register(states: State[]): DataServer {
    for (const state of states) this.states.add(state)
    return this
  }

  public async init(): Promise<void> {
    for (const state of this.states) {
      state.init &&
        (await state.init({
          state: this.getState(),
          setState: this.setState(),
        }))
    }

    await touch(paths.db, JSON.stringify(this.getState(), null, 2))
  }

  public async listen(): Promise<void> {
    if (this.server) {
      this.server.on('connection', socket => {
        const close = this.handleConnection(socket)
        this.server && this.server.on('close', async () => close())
      })
    }
  }

  private handleConnection(socket: WS): () => void {
    const states = Array.from(this.states).map(
      async state =>
        state.update &&
        state.update({
          state: this.getState(),
          setState: this.setState(socket),
        })
    )

    return async () => {
      const fns = await Promise.all(states.filter(Boolean))
      for (const fn of fns) fn && isFn(fn) && fn()
    }
  }

  private getState(): Record<string, any> {
    return Array.from(this.state.entries()).reduce((obj, [key, val]) => {
      return { ...obj, [key]: val }
    }, {})
  }

  private setState(socket?: WS): (key: string, val: any) => void {
    const send = sender(socket)

    return (key: string, val: any): void => {
      this.state.set(key, val)
      send(`state.${key}`, val)
    }
  }
}
