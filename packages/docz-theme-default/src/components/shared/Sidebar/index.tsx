import React from 'react'
import { Docs, Link, Entry, ThemeConfig } from 'docz'
import styled from 'react-emotion'
import { Toggle } from 'react-powerplug'
import { Media } from 'react-breakpoints'

import { Menu } from './Menu'
import { Docz } from './Docz'

interface Wrapper {
  opened: boolean
  desktop: boolean
}

interface OpenProps {
  opened: boolean
}

const wrapperToggle = (p: Wrapper) => (p.opened && !p.desktop ? '-90%' : '0')

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${p => p.theme.colors.sidebarBg};
  background: ${p =>
    wrapperToggle(p) !== '0' ? p.theme.colors.white : p.theme.colors.sidebarBg};
  transition: transform 0.3s, background 0.3s;
  transform: translateX(${wrapperToggle});
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

const toggleBlockTranslateX = (p: OpenProps) => (p.opened ? '10px' : '-6px')
const toggleBlockTranslateY = (p: OpenProps) => (p.opened ? '4px' : '0px')

const ToggleBlock = styled('div')`
  cursor: pointer;
  position: absolute;
  width: 32px;
  height: 36px;
  top: 0;
  right: 0;
  transform: translateX(${toggleBlockTranslateX})
    translateY(${toggleBlockTranslateY});
  transition: transform 0.3s;

  ${p =>
    p.theme.mq({
      display: ['block', 'block', 'block', 'none'],
    })};
`

const toggleBackgroundAppear = (p: OpenProps) => (p.opened ? 'none' : 'block')

const ToggleBackground = styled('div')`
  content: '';
  display: ${toggleBackgroundAppear};
  position: fixed;
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  cursor: pointer;
  z-index: 99;
`

const IconFirst = (p: OpenProps) => (p.opened ? '0px' : '12px')
const IconMiddle = (p: OpenProps) => (p.opened ? '1' : '0')
const IconLast = (p: OpenProps) => (p.opened ? '0px' : '-4px')
const IconRotate = (p: OpenProps) => (p.opened ? '0deg' : '45deg')

const Icon = styled('div')`
  position: relative;
  width: 23px;
  height: 32px;
  margin: auto;
  transform: translateX(-2px);
`

const IconLine = styled('span')`
  content: '';
  display: block;
  position: absolute;
  width: 100%;
  height: 2px;
  left: 0;
  right: 0;
  background: ${p => p.theme.colors.text};
  transition: transform 0.3s, opacity 0.3s;

  &:nth-child(1) {
    top: 10px;
    transform: translateY(${IconFirst}) rotate(${IconRotate});
  }

  &:nth-child(2) {
    top: 18px;
    opacity: ${IconMiddle};
  }

  &:nth-child(3) {
    top: 26px;
    transform: translateY(${IconLast}) rotate(-${IconRotate});
  }
`

const FooterLogo = styled(Docz)`
  fill: ${p => p.theme.colors.footerText};
`

export const Sidebar = () => (
  <Media>
    {({ currentBreakpoint }: any) => {
      return (
        <Toggle initial={true}>
          {({ on, toggle }: any) => {
            const isDesktop = currentBreakpoint === 'desktop' ? true : false

            const handleSidebarToggle = (ev: React.SyntheticEvent<any>) => {
              if (isDesktop) return
              toggle()
            }

            return (
              <Docs>
                {({ docs, menus }) => {
                  const docsWithoutMenu = docs.filter((doc: Entry) => !doc.menu)
                  const fromMenu = (menu: string) =>
                    docs.filter(doc => doc.menu === menu)

                  return (
                    <React.Fragment>
                      <Wrapper opened={on} desktop={isDesktop}>
                        <ToggleBlock opened={on} onClick={handleSidebarToggle}>
                          <Icon>
                            <IconLine opened={on} />
                            <IconLine opened={on} />
                            <IconLine opened={on} />
                          </Icon>
                        </ToggleBlock>
                        <ThemeConfig>
                          {({ title, logo }) =>
                            logo ? (
                              <LogoImg
                                src={logo.src}
                                width={logo.width}
                                alt={title}
                              />
                            ) : (
                              <LogoText>{title}</LogoText>
                            )
                          }
                        </ThemeConfig>
                        <Menus>
                          {docsWithoutMenu.map(doc => (
                            <Link
                              key={doc.id}
                              to={doc.route}
                              onClick={handleSidebarToggle}
                            >
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
                      <ToggleBackground
                        opened={on}
                        onClick={handleSidebarToggle}
                      />
                    </React.Fragment>
                  )
                }}
              </Docs>
            )
          }}
        </Toggle>
      )
    }}
  </Media>
)
