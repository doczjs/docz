import { jsx } from '@emotion/core'
import { SFC, ReactNode, Fragment } from 'react'
import styled from '@emotion/styled'
import Tippy from '@tippy.js/react'

import { get } from '@utils/theme'

interface TooltipProps {
  text: ReactNode
  children: ReactNode
}

const Link = styled('a')`
  text-decoration: none;
  color: ${get('colors.primary')};
`

export const Tooltip: SFC<TooltipProps> = ({ text, children }) => (
  <Tippy content={<Fragment>{text}</Fragment>}>
    <Link href="#" onClick={(ev: any) => ev.preventDefault()}>
      {children}
    </Link>
  </Tippy>
)
