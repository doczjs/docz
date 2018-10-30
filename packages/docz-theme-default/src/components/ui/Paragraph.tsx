import styled from 'react-emotion'
import { get } from '@utils/theme'

export const Paragraph = styled('p')`
  color: ${get('colors.text')};
  ${get('styles.paragraph')};
`
