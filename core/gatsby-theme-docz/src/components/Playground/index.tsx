/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState } from 'react'
import { useConfig } from 'docz'
import {
  LiveProvider,
  LiveProviderProps,
  LiveError,
  LivePreview,
  LiveEditor,
} from 'react-live'
import { merge } from 'lodash/fp'
import { Resizable, ResizableProps } from 're-resizable'
import copy from 'copy-text-to-clipboard'

import { usePrismTheme } from '../../utils/theme'
import { LivePreviewWrapper } from './LivePreviewWrapper'
import * as styles from './styles'
import * as Icons from '../Icons'

interface PlaygroundProps {
  code?: string
  language?: LiveProviderProps['language']
  scope?: LiveProviderProps['scope']
  showLivePreview?: boolean
}

export const Playground: React.FunctionComponent<PlaygroundProps> = ({
  code,
  scope,
  showLivePreview: userShowLivePreview = true,
  language,
}) => {
  const {
    themeConfig: {
      showPlaygroundEditor,
      showLiveError,
      showLivePreview = userShowLivePreview,
    },
  } = useConfig()

  const theme = usePrismTheme()
  const [showingCode, setShowingCode] = useState<boolean>(
    () => showPlaygroundEditor
  )
  const [width, setWidth] = useState(() => '100%')

  const transformCode = (code: string) => {
    if (code.startsWith('()') || code.startsWith('class')) {
      return code
    }

    return `<React.Fragment>${code}</React.Fragment>`
  }

  const toggleCode = () => {
    setShowingCode(s => !s)
  }

  const resizableProps: ResizableProps = {
    minWidth: 260,
    maxWidth: '100%',
    size: {
      height: 'auto',
      width,
    },
    style: {
      margin: '0 auto ',
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
      setWidth(ref.style && ref.style.width ? ref.style.width : 'auto')
    },
  }

  return (
    <Resizable {...resizableProps} data-testid="playground">
      <LiveProvider
        code={code}
        scope={scope}
        transformCode={transformCode}
        language={language}
        theme={merge(theme, {
          plain: {
            fontFamily: 'Inconsolata',
            fontSize: 18,
            lineHeight: '1.5em',
          },
        })}
      >
        <div sx={styles.previewWrapper}>
          <LivePreviewWrapper showingCode={showingCode}>
            {showLivePreview && (
              <LivePreview sx={styles.preview} data-testid="live-preview" />
            )}
          </LivePreviewWrapper>
          <div sx={styles.buttons}>
            <button sx={styles.button} onClick={() => copy(code || '')}>
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
