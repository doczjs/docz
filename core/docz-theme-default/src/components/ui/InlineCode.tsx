import styled from 'styled-components'
import { get } from '~utils/theme'

export const InlineCode = styled.code`
  background: ${get('colors.codeBg')};
  color: ${get('colors.codeColor')};
  ${get('styles.code')};
`
