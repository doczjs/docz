import styled from '@emotion/styled'
import { get } from '@utils/theme'
import { mq } from '@styles/responsive'

export const H1 = styled('h1')`
  position: relative;
  display: table;
  margin: 30px 0;
  ${p => mq(get('styles.h1')(p))};

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
