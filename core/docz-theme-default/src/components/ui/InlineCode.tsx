import styled from '@emotion/styled'
import { get } from '~utils/theme'

export const InlineCode = styled.code`
  background: ${get('colors.codeBg')};
  color: ${get('colors.codeColor')};
  ${get('styles.code')};
`
