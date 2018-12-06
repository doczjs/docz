import styled from '@emotion/styled'
import { get } from '@utils/theme'

export const H4 = styled('h4')`
  ${p => p.theme.docz.mq(get('styles.h4')(p))};
`
