/** @jsx jsx */
import { Fragment, forwardRef, useState, useRef, useEffect } from 'react'
import { Global } from '@emotion/react'
import { jsx, Box } from 'theme-ui'
import { useMenus, useCurrentDoc } from 'docz'

import * as styles from 'gatsby-theme-docz/src/components/Sidebar/styles'
import { NavSearch } from 'gatsby-theme-docz/src/components/NavSearch'
import { NavLink } from 'gatsby-theme-docz/src/components/NavLink'
import { NavGroup } from 'gatsby-theme-docz/src/components/NavGroup'

export const Sidebar = forwardRef(function Sidebar(props, ref) {
  const [query, setQuery] = useState('')
  const menus = useMenus({ query })
  const currentDoc = useCurrentDoc()
  const currentDocRef = useRef()
  const handleChange = ev => {
    setQuery(ev.target.value)
  }
  useEffect(() => {
    if (ref.current && currentDocRef.current) {
      ref.current.scrollTo(0, currentDocRef.current.offsetTop)
    }
  }, [])
  return (
    <Fragment>
      <Box onClick={props.onClick} sx={styles.overlay(props)}>
        {props.open && <Global styles={styles.global} />}
      </Box>
      <Box ref={ref} sx={styles.wrapper(props)} data-testid="sidebar">
        <img src="https://placekitten.com/200/100" />

        <NavSearch
          placeholder="Type to search..."
          value={query}
          onChange={handleChange}
        />
        {menus &&
          menus.map(menu => {
            if (!menu.route)
              return <NavGroup key={menu.id} item={menu} sidebarRef={ref} />
            if (menu.route === currentDoc.route) {
              return (
                <NavLink key={menu.id} item={menu} ref={currentDocRef}>
                  {menu.name}
                </NavLink>
              )
            }
            return (
              <NavLink key={menu.id} item={menu}>
                {menu.name}
              </NavLink>
            )
          })}
      </Box>
    </Fragment>
  )
})
