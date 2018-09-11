import * as React from 'react'
import { Component } from 'react'
import { injectGlobal } from 'emotion'
import styled from 'react-emotion'
import get from 'lodash.get'

const Wrapper = styled('div')`
  display: flex;
  max-width: 100vw;
`

interface MainProps {
  config: any
}

const base = (body: any) =>
  injectGlobal`
    body {
      ${body};
    }
  `

export class Main extends Component<MainProps> {
  public componentDidUpdate(prevProps: MainProps): void {
    const body = this.getBody(this.props)
    const prevBody = this.getBody(prevProps)

    if (body && prevBody !== body) base(body)
  }

  public componentDidMount(): void {
    base(this.getBody(this.props))
  }

  public render(): React.ReactNode {
    return <Wrapper>{this.props.children}</Wrapper>
  }

  private getBody(props: MainProps): any {
    return get(props, 'config.themeConfig.styles.body')
  }
}
