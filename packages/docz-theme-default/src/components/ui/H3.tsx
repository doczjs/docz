import styled from 'react-emotion'
import { get } from '@utils/theme'

export const H3 = styled('h3')`
  ${p => p.theme.docz.mq(get('styles.h3')(p))};
`
