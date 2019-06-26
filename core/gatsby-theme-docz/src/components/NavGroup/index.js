/** @jsx jsx */
import { jsx } from 'theme-ui'

import * as styles from './styles'
import { NavLink } from '../NavLink'

export const NavGroup = ({ item }) => {
  const { menu } = item
  return (
    <div sx={styles.wrapper}>
      <div sx={styles.title}>{item.name}</div>
      {menu &&
        menu.map(menu => {
          return (
            <NavLink key={menu.id} item={menu}>
              {menu.name}
            </NavLink>
          )
        })}
    </div>
  )
}
