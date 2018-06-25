import React from 'react'
import { Docs, Link, Entry, ThemeConfig, DocsRenderProps } from 'docz'
import { Toggle } from 'react-powerplug'
import { Media } from 'react-breakpoints'
import { adopt } from 'react-adopt'
import styled from 'react-emotion'

import { Menu } from './Menu'
import { Docz } from './Docz'
import { Hamburguer } from './Hamburguer'

interface Wrapper {
  opened: boolean
  desktop: boolean
  theme?: any
}

interface OpenProps {
  opened: boolean
}

const toggle = (p: Wrapper) => (p.opened && !p.desktop ? '-90%' : '0')
const background = (p: Wrapper) =>
  toggle(p) !== '0' ? 'transparent' : p.theme.colors.sidebarBg

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 300px;
  height: 100%;
  background: ${background};
  transition: transform 0.2s, background 0.3s;
  transform: translateX(${toggle});
  z-index: 100;

  ${p =>
    p.theme.mq({
      position: ['absolute', 'absolute', 'absolute', 'relative'],
    })};

  ${p => p.theme.styles.sidebar};

  a {
    position: relative;
    display: block;
    padding: 6px 16px;
    font-weight: 600;
    color: ${p => p.theme.colors.sidebarText};
    text-decoration: none;
  }

  a:hover,
  a:visited {
    color: ${p => p.theme.colors.sidebarText};
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
  color: ${p => p.theme.colors.text};

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
  color: ${p => p.theme.colors.footerText};
  border-top: 1px dashed ${p => p.theme.colors.border};

  & > a {
    padding: 0;
    margin-left: 5px;
  }
`

const ToggleBackground = styled('div')`
  content: '';
  display: ${(p: OpenProps) => (p.opened ? 'none' : 'block')};
  position: fixed;
  background-color: rgba(0, 0, 0, 0.4);
  width: 100vw;
  height: 100vh;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  cursor: pointer;
  z-index: 99;
`

const FooterLogo = styled(Docz)`
  fill: ${p => p.theme.colors.footerText};
`

interface RenderProps {
  docs: DocsRenderProps
  media: {
    breakpoints: any
    currentBreakpoint: string
  }
  toggle: {
    on: boolean
    toggle: () => void
  }
  config: {
    title: string
    logo: { src: string; width: any }
  }
}

const Composed = adopt<RenderProps>({
  docs: <Docs />,
  media: <Media />,
  toggle: <Toggle initial={true} />,
  config: <ThemeConfig />,
})

export const Sidebar = () => (
  <Composed>
    {(props: RenderProps) => {
      const {
        media: { currentBreakpoint },
        toggle: { on, toggle },
        docs: { docs, menus },
        config: { title, logo },
      } = props

      const isDesktop = currentBreakpoint === 'desktop' ? true : false
      const docsWithoutMenu = docs.filter((doc: Entry) => !doc.menu)
      const fromMenu = (menu: string) => docs.filter(doc => doc.menu === menu)

      const handleSidebarToggle = (ev: React.SyntheticEvent<any>) => {
        if (isDesktop) return
        toggle()
      }

      return (
        <React.Fragment>
          <Wrapper opened={on} desktop={isDesktop}>
            <Hamburguer opened={on} onClick={handleSidebarToggle} />
            {logo ? (
              <LogoImg src={logo.src} width={logo.width} alt={title} />
            ) : (
              <LogoText>{title}</LogoText>
            )}
            <Menus>
              {docsWithoutMenu.map(doc => (
                <Link key={doc.id} to={doc.route} onClick={handleSidebarToggle}>
                  {doc.name}
                </Link>
              ))}
              {menus.map(menu => (
                <Menu
                  key={menu}
                  sidebarToggle={handleSidebarToggle}
                  menu={menu}
                  docs={fromMenu(menu)}
                />
              ))}
            </Menus>
            <Footer>
              Built with
              <a href="https://docz.site" target="_blank">
                <FooterLogo width={40} />
              </a>
            </Footer>
          </Wrapper>
          <ToggleBackground opened={on} onClick={handleSidebarToggle} />
        </React.Fragment>
      )
    }}
  </Composed>
)
