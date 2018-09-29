import styled from 'react-emotion'
import { get } from '@utils/theme'

export const H6 = styled('h6')`
  ${p => p.theme.docz.mq(get('styles.h6')(p))};
`
