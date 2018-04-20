import React from 'react'
import { NavLink as BaseLink } from 'react-router-dom'
import { Docs } from 'docz-react'
import styled, { css } from 'react-emotion'

import * as colors from '../styles/colors'

const BORDER = '#ced6e0'

const Sidebar = styled('div')`
  padding: 15px 0;
  width: 200px;
  height: 100vh;
  border-right: 1px solid ${colors.BORDER};
  background: ${colors.GRAY_LIGHT};
`

const List = styled('ul')`
  list-style: none;
  padding: 0;
  margin: 5px 0;

  & ~ & {
    margin-top: 10px;
  }
`

const Category = styled('li')`
  padding: 0 20px;
  margin: 20px 0 5px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${colors.GRAY_MEDIUM};
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
  transition: background 0.3s;

  &,
  &:visited {
    color: ${colors.GRAY_DARK};
  }

  &.active {
    background: ${colors.GRAY};
  }

  &:before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${colors.PURPLE};
    transform: scaleX(0);
    transform-origin: 0 50%;
    transition: transform 0.3s;
  }

  &:hover::before,
  &.active:before {
    transform: scaleX(1);
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

const GroupedLinks = ({ categories, docs }) =>
  categories.map(category => (
    <React.Fragment key={category}>
      <Category>{category}</Category>
      <Links
        docs={docs.filter(doc => doc.category && doc.category === category)}
      />
    </React.Fragment>
  ))

export const Menu = () => (
  <Docs>
    {({ loading, categories, docs }) =>
      loading ? (
        <div>loading..</div>
      ) : (
        <Sidebar>
          <List>
            <Links docs={docs.filter(doc => !doc.category)} />
            <GroupedLinks categories={categories} docs={docs} />
          </List>
        </Sidebar>
      )
    }
  </Docs>
)
