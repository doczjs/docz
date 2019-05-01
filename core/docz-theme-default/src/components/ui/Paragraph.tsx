import styled from 'styled-components'
import { get } from '~utils/theme'

export const Paragraph = styled.p`
  color: ${get('colors.text')};
  ${get('styles.paragraph')};
`
