import React from 'react'
import { Docs, Link, Entry, ThemeConfig } from 'docz'
import styled from 'react-emotion'

import { Menu, isActive } from './Menu'

const Wrapper = styled('div')`
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
          {docsWithoutMenu.map(doc => (
            <Link key={doc.id} to={doc.slug} isActive={isActive}>
              {doc.name}
            </Link>
          ))}
          {menus.map(menu => (
            <Menu key={menu} menu={menu} docs={fromMenu(menu)} />
          ))}
        </Wrapper>
      )
    }}
  </Docs>
)
