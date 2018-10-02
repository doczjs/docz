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
      const { type, payload } = JSON.parse(ev.data)
      const prop = type.startsWith('state.') && type.split('.')[1]

      if (prop) {
        state.mutate((state: any) => {
          if (state) state[prop] = payload
        })
      }
    }
  }
}
