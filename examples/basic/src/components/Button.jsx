import React from 'react'
import t from 'prop-types'

const Button = ({ children }) => <button>{children}</button>

Button.propTypes = {
  /**
    Button element children
  */
  children: t.any,
  color: t.string,
}

export default Button
