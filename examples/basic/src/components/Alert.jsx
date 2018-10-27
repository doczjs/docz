import React, { Fragment } from 'react'
import styled from 'react-emotion'
import t from 'prop-types'

const kinds = {
  info: '#5352ED',
  positive: '#2ED573',
  negative: '#FF4757',
  warning: '#FFA502',
}

const AlertStyled = styled('div')`
  padding: 15px 20px;
  background: white;
  border-radius: 3px;
  color: white;
  background: ${({ kind = 'info' }) => kinds[kind]};
`

export const Alert = props => <AlertStyled {...props} />

Alert.propTypes = {
  /** `info`, `positive`, `negative`, or `warning` */
  kind: t.oneOf(['info', 'positive', 'negative', 'warning']),
}

Alert.defaultProps = {
  kind: 'info',
}
