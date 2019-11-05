import React from 'react'
import t from 'prop-types'

const kinds = {
  info: '#5352ED',
  positive: '#2ED573',
  negative: '#FF4757',
  warning: '#FFA502',
}

export const Alert = ({ children, kind, ...rest }) => (
  <div
    style={{
      padding: 20,
      background: 'white',
      borderRadius: 3,
      color: 'white',
      background: kinds[kind],
    }}
    {...rest}
  >
    {children}
  </div>
)

Alert.propTypes = {
  /**
   * The kind prop is used to set the alert's background color
   */
  kind: t.oneOf(['info', 'positive', 'negative', 'warning']),
}

Alert.defaultProps = {
  kind: 'info',
}
