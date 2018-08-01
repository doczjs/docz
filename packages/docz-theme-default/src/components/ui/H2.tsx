import styled from 'react-emotion'

export const H2 = styled('h2')`
  position: relative;
  margin: 50px 0 20px;
  ${p => p.theme.docz.mq(p.theme.docz.styles.h2)};

  .icon-link {
    position: absolute;
    display: inline-block;
    top: 0;
    left: -25px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover .icon-link {
    opacity: 1;
  }
`
