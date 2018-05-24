import React from 'react'
import { Docs, Link, Entry } from 'docz'
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
    border-radius: 5px;
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

export const Sidebar = () => (
  <Docs>
    {({ docs, menus }) => {
      const docsWithoutMenu = docs.filter((doc: Entry) => !doc.menu)
      const fromMenu = (menu: string) => docs.filter(doc => doc.menu === menu)

      return (
        <Wrapper>
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
