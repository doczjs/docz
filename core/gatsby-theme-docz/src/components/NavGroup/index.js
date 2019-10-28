/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from 'react'
import { useCurrentDoc } from 'docz'

import * as styles from './styles'
import { NavLink } from '../NavLink'
import { ChevronDown } from '../Icons'

export const NavGroup = ({ item }) => {
  const current = useCurrentDoc()
  const { name, menu } = item
  const [subheadingsVisible, setShowsubheadings] = React.useState(
    current.menu === name
  )
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
