/** @jsx jsx */
import { jsx } from 'theme-ui'
import * as React from 'react'
import Frame, { FrameContextConsumer } from 'react-frame-component'
import { StyleSheetManager } from 'styled-components'

export const Preview = ({ children }) => {
  return (
    <Frame
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
      }}
    >
      <FrameContextConsumer>
        {frameContext => (
          <StyleSheetManager target={frameContext.document.head}>
            <>{children}</>
          </StyleSheetManager>
        )}
      </FrameContextConsumer>
    </Frame>
  )
}
