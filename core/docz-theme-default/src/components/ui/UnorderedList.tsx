import styled from '@emotion/styled'
import { get } from '@utils/theme'
import { mq } from '@styles/responsive'

export const UnorderedList = styled('ul')`
  list-style: none;

  & li::before {
    content: '● ';
    color: ${get('colors.border')};
    font-weight: bold;
    margin-right: 5px;
  }

  ${p => mq(get('styles.ul')(p))};
`
