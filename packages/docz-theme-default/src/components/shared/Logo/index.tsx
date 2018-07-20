import * as React from 'react'
import { SFC } from 'react'
import styled from 'react-emotion'

const margin = (p: any) =>
  p.theme.mq({
    margin: ['30px', '40px 30px'],
  })

const LogoImg = styled('img')`
  padding: 0;
  ${margin};
`

const LogoText = styled('h1')`
  position: relative;
  padding: 0;
  font-size: 26px;
  color: ${p => p.theme.colors.text};
  ${margin};

  &:before {
    position: absolute;
    content: '';
    bottom: 0;
    left: 0;
    width: 15%;
    height: 3px;
    background: ${p => p.theme.colors.primary};
  }
`

interface LogoProps {
  title: string
  logo: {
    src: string
    width: number
  }
}

export const Logo: SFC<LogoProps> = ({ logo, title }) => {
  return logo ? (
    <LogoImg src={logo.src} width={logo.width} alt={title} />
  ) : (
    <LogoText>{title}</LogoText>
  )
}
