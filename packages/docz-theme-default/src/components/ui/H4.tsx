import styled from '@emotion/styled'
import { get } from '@utils/theme'
import { mq } from '@styles/responsive'

export const H4 = styled('h4')`
  ${p => mq(get('styles.h4')(p))};
`
