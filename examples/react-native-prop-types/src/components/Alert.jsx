import React, { Fragment } from 'react'
import styled from 'styled-components/native'
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
  color: white;
  background: ${({ kind = 'info' }) => kinds[kind]};
`

export const Text = styled.Text`
  color: white;
`

export const Alert = ({ kind = 'info', ...props }: AlertProps) => (
  <AlertStyled {...props} kind={kind} />
)

Alert.propTypes = {
  kind: t.oneOf(['info', 'positive', 'negative', 'warning']),
}

Alert.defaultProps = {
  kind: 'info',
}
