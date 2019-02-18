import * as React from 'react'
import { useState, SFC } from 'react'

import { Button as BaseButton } from '../Button'

export const ButtonSwap: SFC<any> = ({
  as: Button = BaseButton,
  onClick,
  swap,
  children,
  ...props
}) => {
  const hasSwap = Boolean(swap)
  const [on, setOn] = useState(() => false)
  const toggle = () => setOn(s => !s)

  const handleClick = (ev: any) => {
    onClick && onClick(ev)
    hasSwap && toggle()
    hasSwap && setTimeout(toggle, 500)
  }

  return (
    <Button onClick={handleClick} {...props}>
      {on ? swap : children}
    </Button>
  )
}
