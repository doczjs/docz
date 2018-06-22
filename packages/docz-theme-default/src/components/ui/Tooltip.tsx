import * as React from 'react'
import { ThemeConfig } from 'docz'
import { SFC, ReactNode } from 'react'
import { Tooltip as BaseTooltip } from 'react-lightweight-tooltip'

const getStyles = (colors: any) => ({
  wrapper: {
    color: colors.primary,
  },
  content: {
    backgroundColor: colors.tooltipBg,
    color: colors.tooltipColor,
  },
  tooltip: {
    display: 'flex',
    alignItems: 'center',
    width: 220,
    maxWidth: 220,
    padding: 5,
    backgroundColor: colors.tooltipBg,
    borderRadius: '3px',
    fontSize: 16,
  },
  arrow: {
    borderTop: `solid ${colors.tooltipBg} 5px`,
  },
})

interface TooltipProps {
  text: ReactNode
  children: ReactNode
}

export const Tooltip: SFC<TooltipProps> = ({ text, children }) => (
  <ThemeConfig>
    {config => (
      <BaseTooltip styles={getStyles(config.colors)} content={text}>
        {children}
      </BaseTooltip>
    )}
  </ThemeConfig>
)
