import styled from 'react-emotion'

export const H1 = styled('h1')`
  position: relative;
  display: table;
  margin: 30px 0;
  ${p => p.theme.mq(p.theme.styles.h1)};

  &:before {
    position: absolute;
    content: '';
    bottom: 5%;
    left: 0;
    width: 35%;
    height: 2px;
    background: ${p => p.theme.colors.primary};
  }
`
