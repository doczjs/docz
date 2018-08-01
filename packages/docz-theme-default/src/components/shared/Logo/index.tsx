import * as React from 'react'
import { SFC } from 'react'
import { Media } from 'react-breakpoints'
import darken from 'polished/lib/color/darken'
import styled from 'react-emotion'

const LogoImg = styled('img')`
  padding: 0;
  margin: 20px 24px;
`

interface LogoTextProps {
  showBg: boolean
  theme?: any
}

const LogoText = styled('h1')`
  position: relative;
  display: block;
  padding: 24px 24px 24px 30px;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: ${p => p.theme.colors.text};
  background: ${(p: LogoTextProps) =>
    p.showBg ? darken(0.02, p.theme.colors.sidebarBg) : 'transparent'};
`

interface LogoProps {
  title: string
  logo: {
    src: string
    width: number
  }
}

export const Logo: SFC<LogoProps> = ({ logo, title }) => (
  <Media>
    {({ currentBreakpoint }: any) =>
      logo ? (
        <LogoImg src={logo.src} width={logo.width} alt={title} />
      ) : (
        <LogoText showBg={currentBreakpoint === 'desktop'}>{title}</LogoText>
      )
    }
  </Media>
)
