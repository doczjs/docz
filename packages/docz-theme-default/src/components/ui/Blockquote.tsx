import styled from 'react-emotion'

export const Blockquote = styled('blockquote')`
  background: ${p => p.theme.docz.colors.blockquoteBg};
  border-left: 5px solid ${p => p.theme.docz.colors.blockquoteBorder};
  color: ${p => p.theme.docz.colors.blockquoteColor};
  ${p => p.theme.docz.styles.blockquote};

  & > p {
    margin: 0;
    color: ${p => p.theme.docz.colors.blockquoteColor};
  }
`
