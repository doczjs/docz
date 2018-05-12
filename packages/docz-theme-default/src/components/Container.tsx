import { rem } from 'polished'
import styled from 'react-emotion'

export const Container = styled('div')`
  width: ${rem(960)};
  max-width: ${rem(960)};
  padding: ${rem(50)} ${rem(50)} ${rem(100)} ${rem(50)};
  margin: 0 auto;
`
