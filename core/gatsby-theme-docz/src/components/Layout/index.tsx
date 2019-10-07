/** @jsx jsx */
import { jsx, Layout as BaseLayout, Main, Container } from 'theme-ui'
import React, { useState } from 'react'
import { Global } from '@emotion/core'

import { global } from 'docz-components'
import { Header } from '../Header'
import { Sidebar } from '../Sidebar'
import * as styles from './styles'

export const Layout: React.FunctionComponent = ({ children }) => {
  const [open, setOpen] = useState(false)

  return (
    <BaseLayout data-testid="layout">
      <Global styles={global} />
      <Main sx={styles.main}>
        <Header onOpen={() => setOpen(s => !s)} />
        <div sx={styles.wrapper}>
          <Sidebar
            open={open}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onClick={() => setOpen(false)}
          />
          <Container sx={styles.content} data-testid="main-container">
            {children}
          </Container>
        </div>
      </Main>
    </BaseLayout>
  )
}
