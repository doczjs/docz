import styled from 'react-emotion'
import { get } from '@utils/theme'

export const InlineCode = styled('code')`
  background: ${get('colors.codeBg')};
  color: ${get('colors.codeColor')};
  ${p => p.theme.docz.mq(p.theme.docz.styles.code)};
`
