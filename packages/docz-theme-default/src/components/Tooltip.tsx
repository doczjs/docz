import * as React from 'react'
import { SFC, ReactNode } from 'react'
import { Tooltip as BaseTooltip } from 'react-lightweight-tooltip'

import * as colors from '../styles/colors'

interface TooltipProps {
  text: ReactNode
  children: ReactNode
}

const styles = {
  content: {
    backgroundColor: colors.steel,
    color: colors.snow,
  },
  tooltip: {
    display: 'flex',
    alignItems: 'center',
    width: 220,
    maxWidth: 220,
    padding: 5,
    backgroundColor: colors.steel,
    borderRadius: '3px',
  },
  arrow: {
    borderTop: `solid ${colors.steel} 5px`,
  },
}

export const Tooltip: SFC<TooltipProps> = ({ text, children }) => (
  <BaseTooltip styles={styles} content={text}>
    {children}
  </BaseTooltip>
)
