import styled from 'react-emotion'
import { get } from '@utils/theme'

export const H1 = styled('h1')`
  position: relative;
  display: table;
  margin: 30px 0;
  ${p => p.theme.docz.mq(p.theme.docz.styles.h1)};

  &:before {
    position: absolute;
    content: '';
    bottom: 5%;
    left: 0;
    width: 35%;
    height: 2px;
    background: ${get('colors.primary')};
  }
`
