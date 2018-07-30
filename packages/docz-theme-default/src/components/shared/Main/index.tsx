import * as React from 'react'
import { Component } from 'react'
import { injectGlobal } from 'emotion'
import styled from 'react-emotion'

const Wrapper = styled('div')`
  display: flex;
  height: 100vh;
`

interface MainProps {
  config: any
}

const base = (body: any) =>
  injectGlobal`
    body {
      font-family: ${body.fontFamily};
      font-size: ${body.fontSize};
      line-height: ${body.lineHeight};
    }
  `

export class Main extends Component<MainProps> {
  public componentDidUpdate(prevProps: MainProps): void {
    const { config } = this.props
    const prevBody = prevProps.config.styles.body
    const body = config.styles.body

    if (body && prevBody !== body) {
      base(config.styles.body)
    }
  }

  public componentDidMount(): void {
    base(this.props.config.styles.body)
  }

  public render(): React.ReactNode {
    return <Wrapper>{this.props.children}</Wrapper>
  }
}
