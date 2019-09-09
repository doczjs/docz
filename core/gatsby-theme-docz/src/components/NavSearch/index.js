/** @jsx jsx */
import { jsx } from 'theme-ui'

import * as styles from './styles'
import { Search } from '../Icons'

export const NavSearch = props => {
  return (
    <div sx={styles.wrapper} data-testid="nav-search">
      <Search size={20} sx={styles.icon} />
      <input {...props} sx={styles.input} />
    </div>
  )
}
