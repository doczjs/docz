import styled from '@emotion/styled'
import { get } from '@utils/theme'
import { mq } from '@styles/responsive'

export const H5 = styled('h5')`
  ${p => mq(get('styles.h5')(p))};
`
