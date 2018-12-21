import styled from '@emotion/styled'
import { get } from '@utils/theme'
import { mq } from '@styles/responsive'

export const InlineCode = styled('code')`
  background: ${get('colors.codeBg')};
  color: ${get('colors.codeColor')};
  ${p => mq(get('styles.code')(p))};
`
