import 'prismjs/components/prism-jsx'

import React, { PureComponent } from 'react'
import cx from 'classnames'
import prism from 'prismjs'
import styled from 'react-emotion'

import * as colors from '../styles/colors'

const PreStyled = styled('pre')`
  border: 1px solid ${colors.border};
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
