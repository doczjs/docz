/** @jsx jsx */
import { jsx } from 'theme-ui'
import Iframe from 'react-frame-component'

import * as styles from './styles'

const CLEAR_PADDING = `<style> body { padding: 0; margin: 0; }  </style>`
const INITIAL_IFRAME_CONTENT = `<!DOCTYPE html><html><head> ${CLEAR_PADDING} </head><body><div></div></body></html>`

export const IframeWrapper = ({ children, height, style = {} }) => {
  return (
    <Iframe
      initialContent={INITIAL_IFRAME_CONTENT}
      sx={{
        ...styles.previewInner(),
        height,
        ...style,
      }}
    >
      {children}
    </Iframe>
  )
}
