/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from 'react'
import { Search } from 'react-feather'

import * as styles from './styles'

export const NavSearch = (
  props: React.InputHTMLAttributes<HTMLInputElement>
) => {
  return (
    <div sx={styles.wrapper} data-testid="nav-search">
      <Search size={20} sx={styles.icon} />
      <input {...props} sx={styles.input} />
    </div>
  )
}
