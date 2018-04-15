import React from 'react'
import { Link as BaseLink } from 'react-router-dom'
import styled from 'react-emotion'

import { Docs } from 'docz'

const BORDER_COLOR = '#ced6e0'
const LINK_COLOR = '#2f3542'

const Sidebar = styled('ul')`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 200px;
  height: 100vh;
  border-right: 1px solid ${BORDER_COLOR};
`

const Link = styled(BaseLink)`
  display: block;
  padding: 10px 20px;
  border-bottom: 1px solid ${BORDER_COLOR};
  font-size: 14px;
  font-weight: 700;

  &,
  &:visited {
    color: ${LINK_COLOR};
  }
`

export const List = () => (
  <Docs>
    {docs => (
      <Sidebar>
        {docs.map(({ id, name, docRoute }) => (
          <li key={id}>
            <Link to={docRoute}>{name}</Link>
          </li>
        ))}
      </Sidebar>
    )}
  </Docs>
)
