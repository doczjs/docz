import { ReactNode, Component } from 'react'
import { state } from '../state'

interface DataServerProps {
  websocketUrl?: string
}

export class DataServer extends Component<DataServerProps> {
  private socket: WebSocket | null

  constructor(props: DataServerProps, ctx: any) {
    const { websocketUrl } = props

    super(props, ctx)
    this.socket = websocketUrl ? new WebSocket(websocketUrl) : null
  }

  public componentDidMount(): void {
    if (this.socket) this.setupWebsockets(this.socket)
  }

  public render(): ReactNode {
    return this.props.children
  }

  private setupWebsockets(socket: WebSocket): void {
    socket.onmessage = (ev: any) => {
      const message = JSON.parse(ev.data)

      if (message.type === 'state.entries') {
        state.set(state => ({
          ...state,
          entries: message.payload,
        }))
      }

      if (message.type === 'state.config') {
        state.set(state => ({
          ...state,
          config: message.payload,
        }))
      }
    }
  }
}
