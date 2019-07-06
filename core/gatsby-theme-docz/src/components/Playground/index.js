/** @jsx jsx */
import { jsx, useThemeUI } from 'theme-ui'
import { useState } from 'react'
import { LiveProvider, LiveError, LivePreview, LiveEditor } from 'react-live'
import { get, merge } from 'lodash/fp'
import copy from 'copy-text-to-clipboard'

import { usePrismTheme } from '~utils/theme'
import * as styles from './styles'
import * as Icons from '../Icons'

export const Playground = ({ code, scope }) => {
  const [showingCode, setShowingCode] = useState(false)
  const theme = usePrismTheme()
  const ctx = useThemeUI()

  const transformCode = code => {
    if (code.startsWith('()') || code.startsWith('class')) return code
    return `<React.Fragment>${code}</React.Fragment>`
  }

  const toggleCode = () => {
    setShowingCode(s => !s)
  }

  return (
    <LiveProvider
      code={code}
      scope={scope}
      transformCode={transformCode}
      theme={merge(theme, {
        plain: {
          fontFamily: get('theme.fonts.monospace', ctx),
          fontSize: 18,
        },
      })}
    >
      <div sx={styles.previewWrapper}>
        <LivePreview sx={styles.preview(showingCode)} />
        <div sx={styles.buttons}>
          <button sx={styles.button} onClick={() => copy(code)}>
            <Icons.Clipboard size={12} />
          </button>
          <button sx={styles.button} onClick={toggleCode}>
            <Icons.Code size={12} />
          </button>
        </div>
      </div>
      <LiveError sx={styles.error} />
      {showingCode && (
        <div sx={styles.editor(theme)}>
          <LiveEditor />
        </div>
      )}
    </LiveProvider>
  )
}
