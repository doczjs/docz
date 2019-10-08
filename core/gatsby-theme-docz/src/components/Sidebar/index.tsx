/** @jsx jsx */
import React, { useState } from 'react'
import { Global } from '@emotion/core'
import { jsx, Box } from 'theme-ui'
import { useMenus } from 'docz'

import * as styles from './styles'
import { NavSearch } from '../NavSearch'
import { NavLink } from '../NavLink'
import { NavGroup } from '../NavGroup'

interface SidebarProps {
  open: boolean
  onBlur?: React.FocusEventHandler<HTMLDivElement>
  onFocus?: React.FocusEventHandler<HTMLDivElement>
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export const Sidebar: React.FunctionComponent<SidebarProps> = props => {
  const [query, setQuery] = useState('')
  const menus = useMenus({ query })

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(ev.target.value)
  }

  return (
    <React.Fragment>
      <Box onClick={props.onClick} sx={styles.overlay(props)}>
        {props.open && <Global styles={styles.global} />}
      </Box>
      <Box sx={styles.wrapper(props)} data-testid="sidebar">
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
    </React.Fragment>
  )
}
