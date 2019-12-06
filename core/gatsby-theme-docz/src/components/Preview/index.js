/** @jsx jsx */
import { jsx } from 'theme-ui'
import Frame from 'react-frame-component'

export const Preview = ({ children }) => {
  return (
    <Frame
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
      }}
    >
      {children}
    </Frame>
  )
}
