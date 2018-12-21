import styled from '@emotion/styled'
import { get } from '@utils/theme'
import { mq } from '@styles/responsive'

export const Hr = styled('hr')`
  border: none;
  border-top: 1px dashed ${get('colors.border')};

  ${mq({
    margin: ['30px 0', '50px 0'],
  })};
`
