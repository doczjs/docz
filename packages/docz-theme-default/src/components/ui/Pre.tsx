import 'prismjs'
import 'prismjs/components/prism-jsx'

import React, { PureComponent } from 'react'
import prism from 'prismjs'
import styled, { cx } from 'react-emotion'

const PreStyled = styled('pre')`
  border: 1px solid ${p => p.theme.colors.border};
  ${p => p.theme.styles.pre};
`

interface PreProps {
  className: string
  children: any
}

export class Pre extends PureComponent<PreProps> {
  private el: any

  public render(): JSX.Element {
    const { children } = this.props
    const childrenProps = children.props.props
    const childrenClassName = childrenProps && childrenProps.className

    const className = cx('react-prism', this.props.className, childrenClassName)

    return (
      <PreStyled innerRef={ref => (this.el = ref)} className={className}>
        <code>{children.props.children}</code>
      </PreStyled>
    )
  }

  public componentDidMount(): void {
    this.highlightCode()
  }

  public componentDidUpdate(): void {
    this.highlightCode()
  }

  private highlightCode(): void {
    prism.highlightElement(this.el)
  }
}
