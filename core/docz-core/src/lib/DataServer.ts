import * as fs from 'fs-extra'
import WS from 'ws'
import { isFunction } from 'lodash/fp'

import * as paths from '../config/paths'
import { onSignal } from '../utils/on-signal'

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
  id: string
  init: (params: Params) => Promise<any>
  update: (params: Params) => any
  close: (params: Params) => any
}

export class DataServer {
  private client?: WS.Server
  private states: Set<State>
  private state: Record<string, any>

  constructor(server?: any, port?: number, host?: string) {
    this.states = new Set()
    this.state = {}

    if (server) {
      this.client = new WS.Server({
        server,
        port,
        host,
      })
    }
  }

  public register(states: State[]): DataServer {
    for (const state of states) this.states.add(state)
    return this
  }

  public async init(): Promise<void> {
    await Promise.all(
      Array.from(this.states).map(async state => {
        if (!isFunction(state.init)) return
        return state.init({
          state: { ...this.state },
          setState: this.setState(),
        })
      })
    )

    this.updateStateFile()
  }

  public async listen(): Promise<void> {
    if (this.client) {
      this.client.on('connection', socket => {
        const close = this.handleConnection(socket)
        const handleClose = async () => {
          await close()
          socket.terminate()
        }

        this.client!.on('close', handleClose)
        onSignal(handleClose)
      })
    }
  }

  public async close(): Promise<void> {
    await Promise.all(
      Array.from(this.states).map(
        async state =>
          isFunction(state.close) &&
          state.close({
            state: { ...this.state },
            setState: this.setState(),
          })
      )
    )
  }

  private handleConnection(socket: WS): () => void {
    const states = Array.from(this.states).map(
      async state =>
        isFunction(state.update) &&
        state.update({
          state: this.state,
          setState: this.setState(socket),
        })
    )

    return async () => {
      const fns = await Promise.all(states.filter(Boolean))
      for (const fn of fns) isFunction(fn) && fn()
    }
  }

  private setState(socket?: WS): (key: string, val: any) => void {
    const send = sender(socket)

    return (key: string, val: any): void => {
      this.state[key] = val
      send(`state.${key}`, val)
      this.updateStateFile()
    }
  }

  private async updateStateFile(): Promise<void> {
    await fs.outputJSON(paths.db, this.state)
  }
}
