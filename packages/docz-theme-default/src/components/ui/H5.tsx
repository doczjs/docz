import styled from '@emotion/styled'
import { get } from '@utils/theme'

export const H5 = styled('h5')`
  ${p => p.theme.docz.mq(get('styles.h5')(p))};
`
