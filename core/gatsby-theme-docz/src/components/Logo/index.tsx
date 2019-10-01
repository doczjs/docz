/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import { Link, useConfig } from 'docz'

import * as styles from './styles'

export const Logo = () => {
  const config = useConfig()

  return (
    <Flex sx={styles.logo} data-testid="logo">
      <Link to="/" sx={styles.link}>
        {config.title}
      </Link>
    </Flex>
  )
}
