// @flow

import React from 'react'
import styled from '@emotion/styled'

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

const AlertStyled = styled('div')`
  padding: 15px 20px;
  background: white;
  border-radius: 3px;
  color: white;
  background: ${({ kind = 'info' }) => kinds[kind]};
`

export const Alert = ({ kind = 'info', ...props }: AlertProps) => (
  <AlertStyled {...props} kind={kind} />
)
