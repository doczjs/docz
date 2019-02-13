import styled from 'styled-components'
import { get } from '@utils/theme'

export const UnorderedList = styled.ul`
  list-style: none;

  & li::before {
    content: '● ';
    color: ${get('colors.border')};
    font-weight: bold;
    margin-right: 5px;
  }

  ${get('styles.ul')};
`
