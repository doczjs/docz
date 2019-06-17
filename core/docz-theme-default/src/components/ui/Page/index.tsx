/** @jsx jsx */
import { jsx, Main, Container } from 'theme-ui'
import { SFC } from 'react'
import { PageProps } from 'docz'

import { Header } from 'components/shared/Header'

export const Page: SFC<PageProps> = props => {
  return (
    <Main>
      <Header {...props} />
      <Container>{props.children}</Container>
    </Main>
  )
}
