import styled from '@emotion/styled'
import { get } from '@utils/theme'
import { mq } from '@styles/responsive'

export const H3 = styled('h3')`
  ${p => mq(get('styles.h3')(p))};
`
