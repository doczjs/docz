import styled from 'styled-components'
import { get } from '@utils/theme'

export const H1 = styled.h1`
  position: relative;
  display: table;
  margin: 30px 0;

  &:before {
    position: absolute;
    content: '';
    bottom: 5%;
    left: 0;
    width: 35%;
    height: 2px;
    background: ${get('colors.primary')};
  }

  ${get('styles.h1')};
`
