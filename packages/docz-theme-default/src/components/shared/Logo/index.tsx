import * as React from 'react'
import { SFC } from 'react'
import { Media } from 'react-breakpoints'
import { ThemeConfig } from 'docz'
import styled from 'react-emotion'

interface WrapperProps {
  showBg: boolean
  theme?: any
}

const Wrapper = styled('div')`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 24px;
  background: ${(p: WrapperProps) =>
    p.showBg ? p.theme.docz.colors.sidebarBg : 'transparent'};

  &:before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    width: 100%;
    height: ${(p: WrapperProps) => (p.showBg ? '3px' : 0)};
    background: ${p => p.theme.docz.colors.primary};
  }
`

const LogoImg = styled('img')`
  padding: 0;
  margin: 5px 0;
`

const LogoText = styled('h1')`
  margin: 5px 0;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: ${p => p.theme.docz.colors.text};
`

interface LogoProps {
  showBg: boolean
}

export const Logo: SFC<LogoProps> = ({ showBg }) => (
  <Media>
    {({ currentBreakpoint }: any) => (
      <ThemeConfig>
        {({ title, themeConfig: { logo } }) => (
          <Wrapper showBg={showBg || currentBreakpoint === 'desktop'}>
            {logo ? (
              <LogoImg src={logo.src} width={logo.width} alt={title} />
            ) : (
              <LogoText>{title}</LogoText>
            )}
          </Wrapper>
        )}
      </ThemeConfig>
    )}
  </Media>
)
