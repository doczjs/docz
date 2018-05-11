import React, { Fragment } from 'react'
import styled from 'react-emotion'
import t from 'prop-types'

import Button from './Button'

const kinds = {
  info: '#5352ED',
  positive: '#2ED573',
  negative: '#FF4757',
  warning: '#FFA502',
}

const Alert = styled('div')`
  padding: 15px 20px;
  background: white;
  border-radius: 3px;
  color: white;
  background: ${({ kind = 'info' }) => kinds[kind]};
`

Alert.propTypes = {
  color: t.oneOf(['info', 'positive', 'negative', 'warning']),
}

export default Alert
