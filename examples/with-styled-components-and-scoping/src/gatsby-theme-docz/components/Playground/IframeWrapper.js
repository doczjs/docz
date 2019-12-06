/** @jsx jsx */
import { jsx } from 'theme-ui'
import * as React from 'react'
import Iframe, { FrameContextConsumer } from 'react-frame-component'

import { StyleSheetManager } from 'styled-components'

import * as styles from 'gatsby-theme-docz/src/components/Playground/styles'

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
      <FrameContextConsumer>
        {frameContext => (
          <StyleSheetManager target={frameContext.document.head}>
            <>{children}</>
          </StyleSheetManager>
        )}
      </FrameContextConsumer>
    </Iframe>
  )
}
