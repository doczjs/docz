import React, { Fragment } from 'react'
import { Text as BaseText } from 'react-native'
import styled from '@emotion/primitives'
import * as t from 'prop-types'

const kinds = {
  info: '#5352ED',
  positive: '#2ED573',
  negative: '#FF4757',
  warning: '#FFA502',
}

const AlertStyled = styled.View`
  padding: 15px 20px;
  background: white;
  border-radius: 3px;
  background: ${({ kind = 'info' }) => kinds[kind]};
`

export const Text = styled(BaseText)`
  color: white;
`

export const Alert = ({ kind = 'info', ...props }) => (
  <AlertStyled {...props} kind={kind} />
)

Alert.propTypes = {
  kind: t.oneOf(['info', 'positive', 'negative', 'warning']),
}

Alert.defaultProps = {
  kind: 'info',
}
