import React from 'react'
import { Docs, Link, Entry, ThemeConfig } from 'docz'
import styled from 'react-emotion'
import { Toggle } from 'react-powerplug'
import ChevronDown from 'react-feather/dist/icons/chevron-down'

import { Menu } from './Menu'
import logo from '../../../images/docz.svg'

interface Wrapper {
  opened: boolean
}

const wrapperToggle = (p: Wrapper) => (p.opened ? '-90%' : '0')

const Wrapper = styled('div')`
  ${p => p.theme.mq({
    position: ['absolute', 'absolute', 'relative']
  })};
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${p =>
    wrapperToggle(p) !== '0' ? p.theme.colors.white : p.theme.colors.grayLight};
  transition: transform 0.3s, background 0.3s;
  transform: translateX(${wrapperToggle});
  z-index: 100;

  ${p => p.theme.styles.sidebar};

  a {
    position: relative;
    display: block;
    padding: 6px 16px;
    font-weight: 600;
    color: ${p => p.theme.colors.main};
  }

  a:hover,
  a:visited {
    color: ${p => p.theme.colors.main};
  }

  a:hover,
  a.active {
    color: ${p => p.theme.colors.primary};
    font-weight: 600;
  }

  dl {
    padding: 0;
    margin: 0 0 0 20px;
  }

  dl a {
    font-weight: 400;
  }
`

const LogoImg = styled('img')`
  margin: 24px 16px 64px;
  padding: 0;
`

const LogoText = styled('h1')`
  position: relative;
  margin: 24px 16px 64px;
  padding: 0;
  font-size: 32px;

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

const Menus = styled('nav')`
  flex: 1;
`

const Footer = styled('div')`
  padding: 10px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${p => p.theme.colors.grayDark};
  border-top: 1px dashed ${p => p.theme.colors.gray};

  a {
    padding: 0;
    margin-left: 5px;
  }
`

const ToggleBlock = styled('div')`
  position: absolute;
  width: 32px;
  height: 32px;
  top: 0;
  right: 0;
  cursor: pointer;
`

interface IconProps {
  opened: boolean
}

const iconRotate = (p: IconProps) => (p.opened ? '-90deg' : '90deg')

const Icon = styled('div')`
  position: relative;
  top: 50%;
  transform: translateY(-50%) rotate(${iconRotate});
  transform-origin: 50% 50%;
  transition: transform 0.3s;

  & svg {
    display: block;
    margin: auto;
    stroke: ${p => p.theme.colors.main};
  }
`

export const Sidebar = () => (
  <Toggle initial={false}>
    {({ on, toggle }: any) => {
      const handleToggle = (ev: React.SyntheticEvent<any>) => {
        ev.preventDefault()
        toggle()
      }
      return (
        <Docs>
          {({ docs, menus }) => {
            const docsWithoutMenu = docs.filter((doc: Entry) => !doc.menu)
            const fromMenu = (menu: string) =>
              docs.filter(doc => doc.menu === menu)

            return (
              <Wrapper opened={on}>
                <ToggleBlock onClick={handleToggle}>
                  <Icon opened={on}>
                    <ChevronDown size={15} />
                  </Icon>
                </ToggleBlock>
                <ThemeConfig>
                  {({ title, logo }) =>
                    logo ? (
                      <LogoImg src={logo.src} width={logo.width} alt={title} />
                    ) : (
                      <LogoText>{title}</LogoText>
                    )
                  }
                </ThemeConfig>
                <Menus>
                  {docsWithoutMenu.map(doc => (
                    <Link key={doc.id} to={doc.route}>
                      {doc.name}
                    </Link>
                  ))}
                  {menus.map(menu => (
                    <Menu key={menu} menu={menu} docs={fromMenu(menu)} />
                  ))}
                </Menus>
                <Footer>
                  Built with
                  <a href="#" target="_blank">
                    <img src={logo} width={40} alt="Docz" />
                  </a>
                </Footer>
              </Wrapper>
            )
          }}
        </Docs>
      )
    }}
  </Toggle>
)
