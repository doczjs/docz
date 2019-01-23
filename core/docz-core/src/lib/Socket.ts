import WS from 'ws'
import { onSignal } from '../utils/on-signal'

export type Send = (type: string, payload: any) => void
export type On = (type: string) => Promise<any>

const isSocketOpened = (socket: WS) => socket.readyState === WS.OPEN
const sender = (socket?: WS) => (type: string, payload: any) => {
  if (socket && isSocketOpened(socket)) {
    socket.send(JSON.stringify({ type, payload }))
  }
}

export class Socket {
  private client?: WS.Server

  constructor(server?: any, host?: string, port?: number) {
    if (server) {
      this.client = new WS.Server({
        server,
        host,
        port,
      })
    }
  }

  public onConnection(listener: (socket: WS, emit: Send) => () => void): void {
    if (!this.client) return

    this.client.on('connection', socket => {
      const emit = sender(socket)
      const subs = listener(socket, emit)

      const handleClose = async () => {
        subs()
        socket.terminate()
      }

      this.client!.on('close', handleClose)
      onSignal(handleClose)
    })
  }
}
