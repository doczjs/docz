import * as React from 'react'
import { ComponentType as CT, ReactPortal } from 'react'
import * as ReactDOM from 'react-dom'

export const react = (child: CT) => (el: HTMLElement): ReactPortal =>
  ReactDOM.createPortal(React.createElement(child), el)
