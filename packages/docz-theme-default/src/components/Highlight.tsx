import 'prismjs'
import 'prismjs/components/prism-jsx'
import '../styles/prism-github'

import React, { PureComponent } from 'react'
import cx from 'classnames'
import prism from 'prismjs'

interface HighlightProps {
  language: string
}

export class Highlight extends PureComponent<HighlightProps> {
  private el: Element | null

  constructor(props: HighlightProps) {
    super(props)
    this.el = null
  }

  public render(): JSX.Element {
    const className = cx({
      'react-prism': true,
      [`language-${this.props.language}`]: !!this.props.language,
    })

    return (
      <pre
        className={className}
        ref={node => {
          this.el = node
        }}
      >
        <code>{this.props.children}</code>
      </pre>
    )
  }

  public componentDidMount(): void {
    this.highlightCode()
  }

  public componentDidUpdate(): void {
    this.highlightCode()
  }

  private highlightCode(): void {
    prism.highlightElement(this.el as Element)
  }
}
