import styled from 'react-emotion'

export const InlineCode = styled('code')`
  background: ${p => p.theme.docz.colors.codeBg};
  color: ${p => p.theme.docz.colors.codeColor};
  ${p => p.theme.docz.mq(p.theme.docz.styles.code)};
`
