import React from 'react'
import { Docs, Link, Entry, ThemeConfig } from 'docz'
import styled from 'react-emotion'

import { Menu, isActive } from './Menu'
import logo from '../../../images/docz.svg'

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${p => p.theme.colors.grayLight};
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

export const Sidebar = () => (
  <Docs>
    {({ docs, menus }) => {
      const docsWithoutMenu = docs.filter((doc: Entry) => !doc.menu)
      const fromMenu = (menu: string) => docs.filter(doc => doc.menu === menu)

      return (
        <Wrapper>
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
              <Link key={doc.id} to={doc.slug} isActive={isActive}>
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
