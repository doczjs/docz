import React from 'react'
import { doc } from 'docz'

const Button = ({ children }) => <button>{children}</button>

doc('Button').section(() => <Button>Click me</Button>)
