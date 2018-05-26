import styled from 'react-emotion'

export const H1 = styled('h1')`
  position: relative;
  display: table;
  ${p => p.theme.styles.h1};

  &:before {
    position: absolute;
    content: '';
    bottom: 5%;
    left: 0;
    width: 30%;
    height: 3px;
    background: ${p => p.theme.colors.primary};
  }
`
