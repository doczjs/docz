import * as React from 'react'
import { SFC, Fragment } from 'react'
import { PageProps, useConfig } from 'docz'
import Edit from 'react-feather/dist/icons/edit-2'
import styled from 'styled-components'

import { ButtonLink } from './Button'
import { GithubLink, Sidebar, Main } from '../shared'
import { get } from '~utils/theme'
import { mq } from '~styles/responsive'

const Wrapper = styled.div`
  flex: 1;
  color: ${get('colors.text')};
  background: ${get('colors.background')};
  min-width: 0;
  position: relative;
`

export const Container = styled.div`
  box-sizing: border-box;
  margin: 0 auto;

  ${mq({
    width: ['100%', '100%', 920],
    padding: ['20px', '0 40px 40px'],
  })}

  ${get('styles.container')};
`

const EditPage = styled(ButtonLink.withComponent('a'))`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  padding: 2px 8px;
  margin: 8px;
  border-radius: ${get('radii')};
  border: 1px solid ${get('colors.border')};
  opacity: 0.7;
  transition: opacity 0.4s;
  font-size: 14px;
  color: ${get('colors.text')};
  text-decoration: none;
  text-transform: uppercase;

  &:hover {
    opacity: 1;
    background: ${get('colors.border')};
  }

  ${mq({
    visibility: ['hidden', 'hidden', 'visible'],
    top: [0, -60, 32],
    right: [0, 0, 40],
  })};
`

const EditIcon = styled(Edit)<{ width: number }>`
  margin-right: 5px;
`

export const Page: SFC<PageProps> = ({
  children,
  doc: { link, fullpage, edit = true },
}) => {
  const { repository } = useConfig()
  const content = (
    <Fragment>
      {link && edit && (
        <EditPage href={link} target="_blank">
          <EditIcon width={14} /> Edit page
        </EditPage>
      )}
      {children}
    </Fragment>
  )

  return (
    <Main>
      {repository && <GithubLink repository={repository} />}
      {!fullpage && <Sidebar />}
      <Wrapper>{fullpage ? content : <Container>{content}</Container>}</Wrapper>
    </Main>
  )
}
