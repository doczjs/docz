import React from 'react'
import { NavLink as BaseLink } from 'react-router-dom'
import styled, { css } from 'react-emotion'

import { Links } from 'docz'

const BORDER_COLOR = '#ced6e0'
const LINK_COLOR = '#2f3542'
const PURPLE = '#5352ed'

const Sidebar = styled('div')`
  padding: 20px 0;
  width: 250px;
  height: 100vh;
  border-right: 1px solid ${BORDER_COLOR};
`

const List = styled('ul')`
  list-style: none;
  padding: 5px 15px;
  margin: 0;

  & ~ & {
    margin-top: 10px;
  }
`

const GroupTitle = styled('div')`
  font-size: 12px;
  text-transform: uppercase;
  color: #b2bec3;
`

const LinkStyled = styled(BaseLink)`
  display: block;
  padding: 4px 0;
  font-size: 14px;
  font-weight: 700;

  &,
  &:visited {
    color: ${LINK_COLOR};
  }

  &.active {
    color: ${PURPLE};
  }
`

const Link = props => {
  const isActive = (match, location) => match && match.url === location.pathname
  return <LinkStyled isActive={isActive} {...props} />
}

export const Menu = () => (
  <Links>
    {({ groups, docs }) => (
      <Sidebar>
        <List>
          {docs.filter(doc => !doc.group).map(doc => (
            <li key={doc.id}>
              <Link to={doc.route}>{doc.name}</Link>
            </li>
          ))}
        </List>
        {groups.map(group => (
          <List key={group.id}>
            <li>
              <GroupTitle>{group.name}</GroupTitle>
              <List>
                {docs
                  .filter(doc => doc.group && doc.group.id === group.id)
                  .map(doc => (
                    <li key={doc.id}>
                      <Link to={doc.route}>{doc.name}</Link>
                    </li>
                  ))}
              </List>
            </li>
          </List>
        ))}
      </Sidebar>
    )}
  </Links>
)
