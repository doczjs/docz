import * as React from 'react'
import { SFC } from 'react'
import { Toggle } from 'react-powerplug'

import { Button as BaseButton } from './Button'

type AnimatedButtonProps = React.ButtonHTMLAttributes<any> & {
  swap: React.ReactNode
  as?: React.ComponentType<React.ButtonHTMLAttributes<any>>
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
      const handleClick = (ev: any) => {
        toggle()
        onClick && onClick(ev)
        setTimeout(toggle, 500)
      }

      return (
        <Button onClick={handleClick} {...props}>
          {on ? swap : children}
        </Button>
      )
    }}
  </Toggle>
)
