import React, { SFC } from 'react'

export interface LabelProps {
  /**
   * Set this to do the thing
   * @default info
   */
  text: string
}

const Label: SFC<LabelProps> = ({ text, ...props }) => (
  <div className="label" {...props}>
    {text}
  </div>
)

export default Label
