import * as React from 'react'
import { SFC, Fragment } from 'react'
import { PageProps, ThemeConfig } from 'docz'
import lighten from 'polished/lib/color/lighten'
import Edit from 'react-feather/dist/icons/edit-2'
import styled from 'react-emotion'

import { ButtonLink } from './Button'
import { Sidebar, Main } from '../shared'

const Wrapper = styled('div')`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  color: ${p => p.theme.docz.colors.text};
  background: ${p => p.theme.docz.colors.background};
`

export const Container = styled('div')`
  position: relative;
  margin: 0 auto;
  max-width: 100%;
  ${p => p.theme.docz.mq(p.theme.docz.styles.container)};
`

const EditPage = styled(ButtonLink.withComponent('a'))`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  padding: 2px 8px;
  margin: 8px;
  border-radius: 3px;
  border: 1px solid ${p => p.theme.docz.colors.border};
  opacity: 0.7;
  transition: opacity 0.4s;
  font-size: 14px;
  color: ${p => p.theme.docz.colors.text};
  text-decoration: none;
  text-transform: uppercase;

  &:hover {
    opacity: 1;
    background: ${p => lighten(0.1, p.theme.docz.colors.border)};
  }

  ${p =>
    p.theme.docz.mq({
      top: [0, -60, 10],
      right: [0, 0, 32],
    })};
`

const EditIcon = styled(Edit)`
  margin-right: 5px;
`

export const Page: SFC<PageProps> = ({
  children,
  doc: { link, fullpage, edit = true },
}) => {
  const content = (
    <Fragment>
      {link &&
        edit && (
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
