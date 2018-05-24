import * as React from 'react'
import { ThemeConfig } from 'docz'
import { SFC, ReactNode } from 'react'
import { Tooltip as BaseTooltip } from 'react-lightweight-tooltip'

interface TooltipProps {
  text: ReactNode
  children: ReactNode
}

export const Tooltip: SFC<TooltipProps> = ({ text, children }) => (
  <ThemeConfig>
    {({ config }) => (
      <BaseTooltip styles={config.styles.tooltip} content={text}>
        {children}
      </BaseTooltip>
    )}
  </ThemeConfig>
)
