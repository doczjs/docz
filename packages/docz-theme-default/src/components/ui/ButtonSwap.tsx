import * as React from 'react'
import { SFC } from 'react'
import { Toggle } from 'react-powerplug'

import { Button as BaseButton } from './Button'

export type AnimatedButtonProps = React.ButtonHTMLAttributes<any> & {
  as?: React.ComponentType<React.ButtonHTMLAttributes<any>>
  swap?: React.ReactNode
}

export const ButtonSwap: SFC<AnimatedButtonProps> = ({
  as: Button = BaseButton,
  onClick,
  swap,
  children,
  ...props
}) => (
  <Toggle>
    {({ toggle, on }: any) => {
      const hasSwap = Boolean(swap)
      const handleClick = (ev: any) => {
        hasSwap && toggle()
        onClick && onClick(ev)
        hasSwap && setTimeout(toggle, 500)
      }

      return (
        <Button onClick={handleClick} {...props}>
          {on ? swap : children}
        </Button>
      )
    }}
  </Toggle>
)
