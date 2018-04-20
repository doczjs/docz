import 'prismjs'
import 'prismjs/components/prism-jsx'
import '../styles/prism-github'

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import prism from 'prismjs'

export class Highlight extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    language: PropTypes.string,
  }

  render() {
    const className = cx({
      'react-prism': true,
      [`language-${this.props.language}`]: !!this.props.language,
    })

    return (
      <pre
        className={className}
        ref={ref => {
          this.el = ref
        }}
      >
        <code>{this.props.children}</code>
      </pre>
    )
  }

  componentDidMount() {
    this.highlightCode()
  }

  componentDidUpdate() {
    this.highlightCode()
  }

  highlightCode() {
    prism.highlightElement(this.el)
  }
}
