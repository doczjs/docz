import React, { Fragment, SFC } from 'react'
import { DocObj } from 'docz'
import { Docs } from 'docz'
import styled from 'react-emotion'

import * as colors from '../styles/colors'
import { Link } from './Link'

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

interface LinksProps {
  docs: DocObj[]
}

const Links: SFC<LinksProps> = ({ docs }) => (
  <Fragment>
    {docs.map(doc => (
      <li key={doc.id}>
        <Link to={doc.route}>{doc.name}</Link>
      </li>
    ))}
  </Fragment>
)

export const Menu = () => (
  <Docs>
    {({ categories, docs }) => (
      <Sidebar>
        <List>
          <Links docs={docs.filter(doc => !doc.category)} />
          {categories.map(category => (
            <Fragment key={category}>
              <Category>{category}</Category>
              <Links
                docs={docs.filter(
                  doc => doc.category && doc.category === category
                )}
              />
            </Fragment>
          ))}
        </List>
      </Sidebar>
    )}
  </Docs>
)
