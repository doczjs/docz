import { rem } from 'polished'
import styled from 'react-emotion'

import * as colors from '../styles/colors'

export const H1 = styled('h1')`
  position: relative;
  font-size: ${rem(48)};
  font-weight: 200;
  margin: ${rem(30)} 0 ${rem(60)};

  &:before {
    position: absolute;
    content: '';
    bottom: 0;
    left: 0;
    width: 10%;
    height: 3px;
    background: ${colors.purple};
  }
`
