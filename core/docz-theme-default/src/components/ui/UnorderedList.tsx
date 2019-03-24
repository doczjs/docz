import styled from 'styled-components'
import { get } from '@utils/theme'

export const UnorderedList = styled.ul`
  list-style: none;

  & li::before {
    content: '● ';
    color: ${get('colors.border')};
    font-weight: bold;
    font-size: 0.5em;
    margin-right: 5px;
  }

  ${get('styles.ul')};

  ul li {
    padding-left: 25px;
  }
`
