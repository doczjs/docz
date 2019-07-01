/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState } from 'react'
import { LiveProvider, LiveError, LivePreview } from 'react-live'
import copy from 'copy-text-to-clipboard'

import * as styles from './styles'
import * as Icons from '../Icons'
import { Code } from '../Code'

export const Playground = ({ code: initialCode, scope }) => {
  const [code, setCode] = useState(() => initialCode)
  const [showingCode, setShowingCode] = useState(false)

  const transformCode = code => {
    if (code.startsWith('()') || code.startsWith('class')) return code
    return `<React.Fragment>${code}</React.Fragment>`
  }

  const toggleCode = () => {
    setShowingCode(s => !s)
  }

  return (
    <LiveProvider code={code} scope={scope} transformCode={transformCode}>
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
      <Code
        sx={styles.editor(showingCode)}
        codeString={code}
        onChange={setCode}
        language="jsx"
      />
    </LiveProvider>
  )
}
