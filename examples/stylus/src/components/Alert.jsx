import React from 'react'
import t from 'prop-types'

import './Alert.styl'

export const Alert = ({ children, kind, ...rest }) => (
  // space used after alert in order to have kind remain as a separate name
  <div className={'Alert ' + kind} {...rest}>
    {children}
  </div>
)

Alert.propTypes = {
  kind: t.oneOf(['info', 'positive', 'negative', 'warning']),
}

Alert.defaultProps = {
  kind: 'info',
}
