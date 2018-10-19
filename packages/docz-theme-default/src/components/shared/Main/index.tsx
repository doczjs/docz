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

const base = (html: any, body: any) => {
  if (html) {
    injectGlobal`
      html {
        ${html};
      }
    `
  }
  if (body) {
    injectGlobal`
      body {
        ${body};
      }
    `
  }
}

export class Main extends Component<MainProps> {
  public componentDidUpdate(prevProps: MainProps): void {
    const html = this.getHtml(this.props)
    const prevHtml = this.getHtml(prevProps)
    const body = this.getBody(this.props)
    const prevBody = this.getBody(prevProps)

    if ((prevHtml !== html) || (prevBody !== body)) base(html, body)
  }

  public componentDidMount(): void {
    base(this.getHtml(this.props), this.getBody(this.props))
  }

  public render(): React.ReactNode {
    return <Wrapper>{this.props.children}</Wrapper>
  }

  private getHtml(props: MainProps): any {
    return get(props, 'config.themeConfig.styles.html')
  }

  private getBody(props: MainProps): any {
    return get(props, 'config.themeConfig.styles.body')
  }
}
