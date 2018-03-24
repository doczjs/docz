import React, { Fragment } from 'react'
import { doc } from 'playgrodd'
import styled from 'react-emotion'
import t from 'prop-types'

const kinds = {
  info: '#5352ED',
  positive: '#2ED573',
  negative: '#FF4757',
  warning: '#FFA502',
}

const Alert = styled('div')`
  padding: 10px 15px;
  background: white;
  border-radius: 3px;
  color: white;
  background: ${({ kind = 'info' }) => kinds[kind]};
`

Alert.propTypes = {
  color: t.oneOf(['info', 'positive', 'negative', 'warning']),
}

doc('Alert')
  .description('This component is used to show alerts')
  .section('Basic usage', () => <Alert>Some message</Alert>)
  .section('Using different kinds', () => (
    <Fragment>
      <Alert>Some message</Alert>
      <Alert kind="positive">Some message</Alert>
      <Alert kind="negative">Some message</Alert>
      <Alert kind="warning">Some message</Alert>
    </Fragment>
  ))
