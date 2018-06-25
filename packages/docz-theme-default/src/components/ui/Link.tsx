import styled from 'react-emotion'

export const Link = styled('a')`
  &,
  &:visited,
  &:active {
    text-decoration: none;
    color: ${p => p.theme.colors.link};
  }

  &:hover {
    color: ${p => p.theme.colors.link};
  }
`
