import React from 'react'
import { doc } from 'playgrodd'

const Button = ({ children }) => <button>{children}</button>

doc('Button').section(() => <Button>Click me</Button>)
