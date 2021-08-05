import React from 'react'
import t from 'prop-types'

const kinds = {
  info: '#5352ED',
  positive: '#2ED573',
  negative: '#FF4757',
  warning: '#FFA502',
}

const AlertStyled = ({ children, kind, ...rest }) => (
  <div
    style={{
      padding: 20,
      borderRadius: 3,
      color: 'white',
      background: kinds[kind],
    }}
    {...rest}
  >
    {children}
  </div>
)

export const Alert = props => <AlertStyled {...props} />

Alert.propTypes = {
  kind: t.oneOf(['info', 'positive', 'negative', 'warning']),
}

Alert.defaultProps = {
  kind: 'info',
}
