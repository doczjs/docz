import React from 'react'

export const withProps = (mapProps = p => p) => WrappedComponent => props => (
  <WrappedComponent {...props} {...mapProps(props)} />
)
