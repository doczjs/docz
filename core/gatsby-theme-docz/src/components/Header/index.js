/** @jsx jsx */
import { jsx, Box, Flex, useColorMode } from 'theme-ui'
import { useConfig, useCurrentDoc } from 'docz'

import * as styles from './styles'
import { Edit, Sun, Github } from '../Icons'
import { Logo } from '../Logo'

export const Header = () => {
  const config = useConfig()
  const { edit = true, ...doc } = useCurrentDoc()
  const [colorMode, setColorMode] = useColorMode()

  const toggleColorMode = () => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light')
  }

  return (
    <div sx={styles.wrapper} data-testid={'header'}>
      <div sx={styles.innerContainer}>
        <Logo />
        <Flex>
          {config.repository && (
            <Box sx={{ mr: 2 }}>
              <a
                href={config.repository}
                sx={styles.headerButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={15} />
              </a>
            </Box>
          )}
          <button sx={styles.headerButton} onClick={toggleColorMode}>
            <Sun size={15} />
          </button>
        </Flex>
        {edit && doc.link && (
          <a
            sx={styles.editButton}
            href={doc.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Edit width={14} />
            <Box sx={{ pl: 2 }}>Edit page</Box>
          </a>
        )}
      </div>
    </div>
  )
}
