import * as React from 'react'
import { SFC, Fragment } from 'react'
import { PageProps, ThemeConfig } from 'docz'
import Edit from 'react-feather/dist/icons/edit-2'
import styled from 'react-emotion'

import { ButtonLink } from './Button'
import { Sidebar, Main } from '../shared'

const Wrapper = styled('div')`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  color: ${p => p.theme.colors.text};
  background: ${p => p.theme.colors.background};
`

export const Container = styled('div')`
  position: relative;
  margin: 0 auto;
  width: 960px;
  max-width: 100%;
  ${p => p.theme.mq(p.theme.styles.container)};
`

const EditPage = styled(ButtonLink.withComponent('a'))`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  padding: 2px 8px;
  margin: 8px;
  border-radius: 3px;
  border: 1px solid ${p => p.theme.colors.border};
  opacity: 0.7;
  transition: opacity 0.4s;
  font-size: 13px;
  color: ${p => p.theme.colors.text};
  text-decoration: none;
  text-transform: uppercase;

  &:hover {
    opacity: 1;
  }

  ${p =>
    p.theme.mq({
      top: [0, 10],
      right: [0, 42],
    })};
`

const EditIcon = styled(Edit)`
  margin-right: 5px;
`

export const Page: SFC<PageProps> = ({ children, doc: { link, fullpage } }) => {
  const content = (
    <Fragment>
      {link && (
        <EditPage href={link} target="_blank">
          <EditIcon width={14} /> Edit page
        </EditPage>
      )}
      {children}
    </Fragment>
  )

  return (
    <ThemeConfig>
      {config => (
        <Main config={config}>
          {!fullpage && <Sidebar />}
          <Wrapper>
            {fullpage ? content : <Container>{content}</Container>}
          </Wrapper>
        </Main>
      )}
    </ThemeConfig>
  )
}
