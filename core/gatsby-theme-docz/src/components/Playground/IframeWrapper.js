/** @jsx jsx */
import { jsx } from 'theme-ui'
import Iframe from 'react-frame-component'

import * as styles from './styles'

const CODE_FONT = `<style type="text/css">@import url(https://fonts.googleapis.com/css?family=Inconsolata&display=swap);</style>`
const INITIAL_IFRAME_CONTENT = `<!DOCTYPE html><html><head> ${CODE_FONT} <style> \n body { padding: 0; margin: 0; }  </style></head><body><div></div></body></html>`

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
