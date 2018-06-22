import React, { Fragment } from 'react'
import cx from 'classnames'
import t from 'prop-types'

import styles from './Alert.module.styl'

export const Alert = ({ children, kind }) => (
  <div
    className={cx(styles.alert, {
      [styles[kind]]: true,
    })}
  >
    {children}
  </div>
)

Alert.propTypes = {
  kind: t.oneOf(['info', 'positive', 'negative', 'warning']),
}

Alert.defaultProps = {
  kind: 'info',
}
