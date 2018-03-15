import React from 'react'

export const Button = ({ children, ...props }) => (
  <button {...props}>{children}</button>
)
