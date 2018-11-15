import styled from 'react-emotion'
import { get } from '@utils/theme'

export const OrderedList = styled('ol')`
  list-style: none;
  counter-reset: my-awesome-counter;

  & li {
    counter-increment: my-awesome-counter;
  }

  & li::before {
    content: counter(my-awesome-counter) '. ';
    color: ${get('colors.border')};
    font-weight: bold;
    font-family: 'Playfair Display', serif;
    margin-right: 5px;
  }

  ${p => p.theme.docz.mq(p.theme.docz.styles.ol)};
`
