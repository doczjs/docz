/** @jsx jsx */
import { jsx } from 'theme-ui'

import * as styles from './styles'
import { Search } from '../Icons'
import React from 'react'

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
