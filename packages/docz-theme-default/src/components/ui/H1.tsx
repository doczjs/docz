import styled from 'react-emotion'

export const H1 = styled('h1')`
  position: relative;
  ${p => p.theme.styles.h1};

  &:before {
    position: absolute;
    content: '';
    bottom: 0;
    left: 0;
    width: 10%;
    height: 3px;
    background: ${p => p.theme.colors.primary};
  }
`
