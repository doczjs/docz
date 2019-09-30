/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from 'react'

import * as styles from './styles'
import { NavLink } from '../NavLink'
import { ChevronDown, ChevronUp } from '../Icons'

export const NavGroup = ({ item }) => {
  const { menu } = item
  const [subheadingsVisible, setShowsubheadings] = React.useState(true)
  const toggleSubheadings = () => setShowsubheadings(!subheadingsVisible)
  const exandCollapseIcon = subheadingsVisible ? <ChevronUp /> : <ChevronDown />
  return (
    <div sx={styles.wrapper} data-testid="nav-group">
      <div sx={styles.title} onClick={toggleSubheadings}>
        {item.name} {exandCollapseIcon}
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
