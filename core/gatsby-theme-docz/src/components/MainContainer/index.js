/** @jsx jsx */
import { jsx, Container } from 'theme-ui'

import * as styles from './styles'

export const MainContainer = ({ children, ...rest }) => {
  return (
    <Container sx={styles.container} {...rest}>
      {children}
    </Container>
  )
}
