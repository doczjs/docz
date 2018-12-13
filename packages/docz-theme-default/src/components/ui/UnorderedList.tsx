import styled from '@emotion/styled'
import { get } from '@utils/theme'

export const UnorderedList = styled('ul')`
  list-style: none;

  & li::before {
    content: '● ';
    color: ${get('colors.border')};
    font-weight: bold;
    margin-right: 5px;
  }

  ${p => p.theme.docz.mq(p.theme.docz.styles.ul)};
`
