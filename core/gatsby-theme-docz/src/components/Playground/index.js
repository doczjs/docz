/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState } from 'react'
import { useConfig } from 'docz'
import { LiveProvider, LiveError, LivePreview, LiveEditor } from 'react-live'
import { Resizable } from 're-resizable'
import copy from 'copy-text-to-clipboard'

import { usePrismTheme } from '~utils/theme'
import * as styles from './styles'
import * as Icons from '../Icons'

export const Playground = ({ code, scope, language }) => {
  const {
    themeConfig: { showPlaygroundEditor, showLiveError, showLivePreview },
  } = useConfig()

  const theme = usePrismTheme()
  const [showingCode, setShowingCode] = useState(() => showPlaygroundEditor)
  const [width, setWidth] = useState(() => '100%')

  const transformCode = code => {
    if (code.startsWith('()') || code.startsWith('class')) return code
    return `<React.Fragment>${code}</React.Fragment>`
  }

  const copyCode = () => copy(code)

  const toggleCode = () => setShowingCode(s => !s)

  const resizableProps = {
    minWidth: 260,
    maxWidth: '100%',
    size: {
      width,
      height: 'auto',
    },
    style: {
      margin: '0 auto',
    },
    enable: {
      top: false,
      right: true,
      bottom: false,
      left: false,
      topRight: false,
      bottomRight: false,
      bottomLeft: false,
      topLeft: false,
    },
    onResizeStop: (e, direction, ref) => {
      setWidth(ref.style.width)
    },
  }

  return (
    <Resizable {...resizableProps} data-testid="playground">
      <LiveProvider
        code={code}
        scope={scope}
        transformCode={transformCode}
        language={language}
        theme={theme}
      >
        <div sx={styles.previewWrapper}>
          <div sx={styles.previewInner(showingCode)}>
            {showLivePreview && (
              <LivePreview sx={styles.preview} data-testid="live-preview" />
            )}
          </div>
          <div sx={styles.buttons}>
            <button sx={styles.button} onClick={copyCode}>
              <Icons.Clipboard size={12} />
            </button>
            <button sx={styles.button} onClick={toggleCode}>
              <Icons.Code size={12} />
            </button>
          </div>
        </div>
        {showLiveError && (
          <LiveError sx={styles.error} data-testid="live-error" />
        )}
        {showingCode && (
          <div sx={styles.editor(theme)}>
            <LiveEditor data-testid="live-editor" />
          </div>
        )}
      </LiveProvider>
    </Resizable>
  )
}
