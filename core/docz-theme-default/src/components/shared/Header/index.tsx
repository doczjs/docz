/** @jsx jsx */
import { SFC } from 'react'
import { jsx, Box, Flex, Container, useColorMode } from 'theme-ui'
import { useConfig, PageProps } from 'docz'
import Edit from 'react-feather/dist/icons/edit-2'
import Sun from 'react-feather/dist/icons/sun'
import Menu from 'react-feather/dist/icons/menu'
import Github from 'react-feather/dist/icons/github'
import styled from '@emotion/styled'

import { themeProp } from '~utils/theme'
import * as styles from './styles'

const Wrapper = styled(Box)`
  border-bottom: 1px solid ${themeProp('colors.sidebarBorder')};
`

export const Header: SFC<PageProps> = ({
  doc: {
    value: { link, edit = true },
  },
}) => {
  const config = useConfig()
  const Link: any = config.linkComponent
  const [colorMode, setColorMode] = useColorMode()

  const toggleColorMode = () => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light')
  }

  return (
    <Wrapper css={styles.wrapper}>
      <Container>
        <div css={styles.innerContainer}>
          <Flex aligmItems="center">
            <button css={styles.menuButton}>
              <Menu size={30} />
            </button>
            <Box pl={3}>
              <Link to="/" css={styles.link}>
                {config.title}
              </Link>
            </Box>
          </Flex>
          <Flex>
            {config.repository && (
              <Box mr={3}>
                <a
                  href={config.repository}
                  css={styles.headerButton}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={15} />
                </a>
              </Box>
            )}
            <button css={styles.headerButton} onClick={toggleColorMode}>
              <Sun size={15} />
            </button>
          </Flex>
          {link && edit && (
            <a
              css={styles.editButton}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Edit width={14} />
              <Box pl={2}>Edit page</Box>
            </a>
          )}
        </div>
      </Container>
    </Wrapper>
  )
}
