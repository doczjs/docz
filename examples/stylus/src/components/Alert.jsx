import React from 'react'
import t from 'prop-types'

import './Alert.styl'

export const Alert = ({ children, kind, ...rest }) => (
  <div className="Alert" {...rest}>
    {children}
  </div>
)

Alert.propTypes = {
  kind: t.oneOf(['info', 'positive', 'negative', 'warning']),
}

Alert.defaultProps = {
  kind: 'info',
}
