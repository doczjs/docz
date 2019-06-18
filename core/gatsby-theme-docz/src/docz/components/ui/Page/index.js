/** @jsx jsx */
import { jsx, Main, Container } from 'theme-ui'
import { Header } from '@docz/components/shared/Header'

export const Page = props => {
  return (
    <Main>
      <Header {...props} />
      <Container>{props.children}</Container>
    </Main>
  )
}
