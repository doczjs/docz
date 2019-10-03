import React from 'react'
import t from 'prop-types'

const Label = ({ text, ...props }) => (
  <div className="label" {...props}>
    {text}
  </div>
)

Label.propTypes = {
  /** A nice string */
  text: t.string,
}

export default Label
