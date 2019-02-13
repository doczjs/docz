import styled from 'styled-components'
import { get } from '@utils/theme'

export const Hr = styled.hr`
  border: none;
  border-top: 1px dashed ${get('colors.border')};
  margin: 40px 0;

  ${get('styles.hr')};
`
