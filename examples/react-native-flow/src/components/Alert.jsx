// @flow

import React, { Fragment } from 'react'
import { Text as BaseText } from 'react-native'
import styled from 'styled-components/native'

const kinds = {
  info: '#5352ED',
  positive: '#2ED573',
  negative: '#FF4757',
  warning: '#FFA502',
}

type Kind = 'info' | 'positive' | 'negative' | 'warning'

type AlertProps = {
  /**
   * Set this to change alert kind
   */
  kind: Kind,
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

export const Alert = ({ kind = 'info', ...props }: AlertProps) => (
  <AlertStyled {...props} kind={kind} />
)
