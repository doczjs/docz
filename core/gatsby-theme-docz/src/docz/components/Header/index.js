/** @jsx jsx */
import { jsx, Box, Flex, Container, useColorMode } from 'theme-ui'
import { Link, useConfig, useCurrentDoc } from 'docz'
import styled from '@emotion/styled'

import { themeProp } from '@docz/utils/theme'
import { Edit, Sun, Menu, Github } from '../Icons'
import * as styles from './styles'

const Wrapper = styled(Box)`
  border-bottom: 1px solid ${themeProp('colors.header.border')};
`

export const Header = () => {
  const config = useConfig()
  const { edit = true, ...doc } = useCurrentDoc()
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
          {edit && doc.link && (
            <a
              css={styles.editButton}
              href={doc.link}
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
