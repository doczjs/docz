import * as React from 'react'
import { SFC, ReactNode } from 'react'
import { ThemeConfig } from 'docz'
import BaseTooltip from 'rc-tooltip'
import styled, { css } from 'react-emotion'

interface TooltipProps {
  text: ReactNode
  children: ReactNode
}

const overlayClass = (colors: Record<string, any>) => css`
  .rc-tooltip-inner {
    background: ${colors.tooltipBg};
    color: ${colors.tooltipColor};
  }

  .rc-tooltip-arrow {
    border-top-color: ${colors.tooltipBg};
  }
`

const Link = styled('a')`
  text-decoration: none;
  color: initial;
`

export const Tooltip: SFC<TooltipProps> = ({ text, children }) => (
  <ThemeConfig>
    {config => (
      <BaseTooltip
        placement="top"
        trigger={['hover']}
        overlay={text}
        overlayClassName={overlayClass(config.themeConfig.colors)}
      >
        <Link href="#" onClick={ev => ev.preventDefault()}>
          {children}
        </Link>
      </BaseTooltip>
    )}
  </ThemeConfig>
)
