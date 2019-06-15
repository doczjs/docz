import styled from '@emotion/styled'
import { get } from '~utils/theme'

export const Blockquote = styled.blockquote`
  background: ${get('colors.blockquoteBg')};
  border-left: 5px solid ${get('colors.blockquoteBorder')};
  color: ${get('colors.blockquoteColor')};
  ${get('styles.blockquote')};

  & > p {
    margin: 0;
    color: ${get('colors.blockquoteColor')};
  }
`
