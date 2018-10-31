import * as React from 'react'
import { ReactNode, ComponentType, Component } from 'react'

import { isFn } from '../utils/helpers'

interface Props {
  as: ComponentType<any>
  getInitialData?: (props: any) => any
}

interface State {
  loading: boolean
  data: any
  error: any
}

export class AsyncComponent extends Component<Props, State> {
  public state = {
    loading: true,
    error: null,
    data: {},
  }

  public componentDidMount(): void {
    this.fetch()
  }

  public render(): ReactNode {
    const { as: Comp = 'div', getInitialData, ...props } = this.props
    const { data, loading, error } = this.state

    return <Comp {...props} data={{ ...data, loading, error }} />
  }

  private async fetch(): Promise<void> {
    const { getInitialData } = this.props

    if (getInitialData && isFn(getInitialData)) {
      this.setState({ loading: true })

      try {
        const data = await getInitialData(this.props)
        this.setState({
          data,
          error: null,
          loading: false,
        })
      } catch (error) {
        this.setState({
          error,
          data: {},
          loading: false,
        })
      }
    }
  }
}
