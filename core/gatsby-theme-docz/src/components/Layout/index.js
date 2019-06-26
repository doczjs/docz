/** @jsx jsx */
import { useRef, useState } from 'react'
import { jsx, Layout as BaseLayout, Main, Container } from 'theme-ui'
import { Global } from '@emotion/core'

import global from '~theme/global'
import { Header } from '../Header'
import { Sidebar } from '../Sidebar'
import * as styles from './styles'

export const Layout = ({ children }) => {
  const [open, setOpen] = useState(false)
  const nav = useRef()

  return (
    <BaseLayout sx={{ '& > div': { flex: '1 1 auto' } }}>
      <Global styles={global} />
      <Main>
        <Header nav={nav} onOpen={setOpen} />
        <Container sx={styles.container}>
          <Sidebar
            ref={nav}
            open={open}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onClick={() => setOpen(false)}
          />
          <div sx={styles.content}>{children}</div>
        </Container>
      </Main>
    </BaseLayout>
  )
}
