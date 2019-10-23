import React from 'react'
import { MemoryRouter } from 'react-router-dom'

// eslint-disable-next-line react/display-name
export default ({ children }) => {
  return <MemoryRouter>{children}</MemoryRouter>
}
