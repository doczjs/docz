import React from 'react'
import { Docs, Link as BaseLink, Entry } from 'docz'
import styled from 'react-emotion'

import * as colors from '../../styles/colors'
import { Menu, menuStyle } from './Menu'

const Wrapper = styled('div')`
  width: 320px;
  height: 100%;
  border-right: 1px solid ${colors.border};
`

const Link = styled(BaseLink)`
  ${menuStyle};
`

export const Sidebar = () => (
  <Docs>
    {({ docs, menus }) => {
      const docsWithoutMenu = docs.filter((doc: Entry) => !doc.menu)

      return (
        <Wrapper>
          {docsWithoutMenu.map(doc => (
            <Link key={doc.id} to={doc.slug}>
              {doc.name}
            </Link>
          ))}
          {menus.map(
            menu =>
              menu && (
                <Menu
                  key={menu}
                  menu={menu}
                  docs={docs.filter(doc => doc.menu && doc.menu === menu)}
                />
              )
          )}
        </Wrapper>
      )
    }}
  </Docs>
)
