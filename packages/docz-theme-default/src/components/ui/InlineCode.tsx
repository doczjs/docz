import styled from 'react-emotion'

export const InlineCode = styled('code')`
  background: ${p => p.theme.colors.codeBg};
  color: ${p => p.theme.colors.codeColor};
  ${p => p.theme.mq(p.theme.styles.code)};
`
