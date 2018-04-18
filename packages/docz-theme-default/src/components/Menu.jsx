import React from 'react'
import { NavLink as BaseLink } from 'react-router-dom'
import styled, { css } from 'react-emotion'

import { Docs } from 'docz'

const BORDER_COLOR = '#ced6e0'
const LINK_COLOR = '#2f3542'
const PURPLE = '#6554C0'
const GRAY = '#EAECEF'
const GRAY_LIGHT = '#F4F5F7'
const GRAY_MEDIUM = '#C1C7D0'

const Sidebar = styled('div')`
  padding: 15px 0;
  width: 200px;
  height: 100vh;
  border-right: 1px solid ${BORDER_COLOR};
  background: ${GRAY_LIGHT};
`

const List = styled('ul')`
  list-style: none;
  padding: 0;
  margin: 5px 0;

  & ~ & {
    margin-top: 10px;
  }
`

const Group = styled('li')`
  padding: 0 20px;
  margin: 20px 0 5px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${GRAY_MEDIUM};
`

const LinkStyled = styled(BaseLink)`
  position: relative;
  display: block;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 400;
  color: white;
  background: transparent;
  border-radius: 3px;

  &,
  &:visited {
    color: ${LINK_COLOR};
  }

  &.active {
    background: ${GRAY};
  }

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: ${PURPLE};
  }
`

const Link = props => {
  const isActive = (match, location) => match && match.url === location.pathname
  return <LinkStyled isActive={isActive} {...props} />
}

const Links = ({ docs }) =>
  docs.map(doc => (
    <li key={doc.id}>
      <Link to={doc.route}>{doc.name}</Link>
    </li>
  ))

const GroupedLinks = ({ groups, docs }) =>
  groups.map(group => (
    <React.Fragment key={group.id}>
      <Group>{group.name}</Group>
      <Links
        docs={docs.filter(doc => doc.group && doc.group.id === group.id)}
      />
    </React.Fragment>
  ))

export const Menu = () => (
  <Docs>
    {({ groups, docs }) => (
      <Sidebar>
        <List>
          <Links docs={docs.filter(doc => !doc.group)} />
          <GroupedLinks groups={groups} docs={docs} />
        </List>
      </Sidebar>
    )}
  </Docs>
)
