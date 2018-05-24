import * as React from 'react'
import { Component } from 'react'
import styled from 'react-emotion'
import equals from 'fast-deep-equal'

import { base } from '../../../styles/base'

const Wrapper = styled('div')`
  display: flex;
  height: 100vh;
`

interface MainProps {
  config: any
}

export class Main extends Component<MainProps> {
  public componentDidUpdate(prevProps: MainProps): void {
    const { config } = this.props

    if (!equals(prevProps.config, config)) {
      base(config)
    }
  }

  public componentDidMount(): void {
    base(this.props.config)
  }

  public render(): React.ReactNode {
    return <Wrapper>{this.props.children}</Wrapper>
  }
}
