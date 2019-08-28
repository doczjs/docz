/** @jsx jsx */
import React, { useState } from 'react'
import { Global } from '@emotion/core'
import { jsx, Box } from 'theme-ui'
import { useMenus } from 'docz'

import * as styles from './styles'
import { NavSearch } from '../NavSearch'
import { NavLink } from '../NavLink'
import { NavGroup } from '../NavGroup'

export const Sidebar = React.forwardRef((props, ref) => {
  const [query, setQuery] = useState('')
  const menus = useMenus({ query })

  const handleChange = ev => {
    setQuery(ev.target.value)
  }

  return (
    <>
      <Box onClick={props.onClick} sx={styles.overlay(props)}>
        {props.open && <Global styles={styles.global} />}
      </Box>
      <Box ref={ref} sx={styles.wrapper(props)}>
        <NavSearch
          placeholder="Type to search..."
          value={query}
          onChange={handleChange}
        />
        {menus &&
          menus.map(menu => {
            if (!menu.route) return <NavGroup key={menu.id} item={menu} />
            return (
              <NavLink key={menu.id} item={menu}>
                {menu.name}
              </NavLink>
            )
          })}
      </Box>
    </>
  )
})
