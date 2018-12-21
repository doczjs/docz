import styled from '@emotion/styled'
import { get } from '@utils/theme'
import { mq } from '@styles/responsive'

export const H6 = styled('h6')`
  ${p => mq(get('styles.h6')(p))};
`
