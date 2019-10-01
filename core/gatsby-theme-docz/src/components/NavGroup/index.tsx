/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from 'react'

import * as styles from './styles'
import { NavLink } from '../NavLink'
import { ChevronDown } from '../Icons'
import { MenuItem } from 'docz'

interface NavGroupProps {
  item: MenuItem
}

export const NavGroup: React.FunctionComponent<NavGroupProps> = ({ item }) => {
  const { menu } = item
  const [subheadingsVisible, setShowsubheadings] = React.useState(true)
  const toggleSubheadings = () => setShowsubheadings(!subheadingsVisible)

  return (
    <div sx={styles.wrapper} data-testid="nav-group">
      <div sx={styles.title} onClick={toggleSubheadings}>
        {item.name}
        <ChevronDown sx={styles.chevron({ active: subheadingsVisible })} />
      </div>
      <div sx={styles.sublinkWrapper} data-testid="nav-group-links">
        {menu &&
          subheadingsVisible &&
          menu.map(menu => {
            return (
              <NavLink key={menu.id} item={menu}>
                {menu.name}
              </NavLink>
            )
          })}
      </div>
    </div>
  )
}
