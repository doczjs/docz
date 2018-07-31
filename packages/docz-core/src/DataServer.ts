import WS from 'ws'

export type Send = (type: string, payload: any) => void

const send = (socket: WS) => (type: string, payload: any) => {
  socket.send(JSON.stringify({ type, payload }))
}

interface Action {
  onStart: (send: Send, socket: WS) => void
  onClose?: () => void
  onError?: () => void
}

export class DataServer {
  private server: WS.Server
  private actions: Set<Action>

  constructor(server: any, port: number, host: string) {
    this.actions = new Set()
    this.server = new WS.Server({ server, port, host })
  }

  public dispatch(action: Action): void {
    this.actions.add(action)
  }

  public init(): void {
    this.server.on('connection', socket => this.handleConnection(socket))
    this.server.on('close', () => this.handleClose())
  }

  private async handleConnection(socket: WS): Promise<void> {
    this.actions.forEach(async ({ onStart }) => onStart(send(socket), socket))
  }

  private async handleClose(): Promise<void> {
    this.actions.forEach(async ({ onClose }) => onClose && onClose())
  }
}
