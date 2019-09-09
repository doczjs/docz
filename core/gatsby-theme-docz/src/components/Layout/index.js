/** @jsx jsx */
import { useRef, useState } from 'react'
import { jsx, Box, Layout as BaseLayout, Main, Container } from 'theme-ui'
import { Global } from '@emotion/core'

import global from '~theme/global'
import { Header } from '../Header'
import { Sidebar } from '../Sidebar'
import { Menu } from '../Icons'
import * as styles from './styles'

export const Layout = ({ children }) => {
  const [open, setOpen] = useState(false)
  const nav = useRef()

  const handleMenu = () => {
    setOpen(s => !s)
    if (!nav.current) return
    const navLink = nav.current.querySelector('a')
    if (navLink) navLink.focus()
  }

  return (
    <BaseLayout sx={{ '& > div': { flex: '1 1 auto' } }} data-testid="layout">
      <Global styles={global} />
      <Main sx={styles.main}>
        <Header nav={nav} onOpen={setOpen} />
        <div sx={styles.wrapper}>
          <Sidebar
            ref={nav}
            open={open}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onClick={() => setOpen(false)}
          />
          <Container sx={styles.content} data-testid="main-container">
            <Box sx={styles.menuIcon}>
              <button sx={styles.menuButton} onClick={handleMenu}>
                <Menu size={25} />
              </button>
            </Box>
            {children}
          </Container>
        </div>
      </Main>
    </BaseLayout>
  )
}
