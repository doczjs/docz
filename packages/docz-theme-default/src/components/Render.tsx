import * as React from 'react'
import { Component } from 'react'

interface RenderProps {
  render: (container: HTMLElement) => any
}

interface RenderState {
  container: HTMLElement | null
}

export class Render extends Component<RenderProps, RenderState> {
  private container: HTMLElement | null

  constructor(props: RenderProps) {
    super(props)
    this.container = null

    this.state = {
      container: null,
    }
  }

  public componentDidMount(): void {
    if (this.container) {
      this.setState({ container: this.container })
    }
  }

  public render(): JSX.Element {
    const { render } = this.props
    const { container } = this.state

    return (
      <div ref={node => (this.container = node)}>
        {container && render(container)}
      </div>
    )
  }
}
