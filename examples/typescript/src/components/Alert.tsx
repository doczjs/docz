import React, { SFC } from 'react'
import styled from 'styled-components'

export type Kind = 'info' | 'positive' | 'negative' | 'warning'
export type KindMap = Record<Kind, string>

const kinds: KindMap = {
  info: '#5352ED',
  positive: '#2ED573',
  negative: '#FF4757',
  warning: '#FFA502',
}

export interface AlertProps {
  /**
   * Set this to change alert kind
   * @default info
   */
  kind: 'info' | 'positive' | 'negative' | 'warning'
}

const AlertStyled = styled('div')`
  padding: 15px 20px;
  background: white;
  border-radius: 3px;
  color: white;
  background: ${({ kind = 'info' }: AlertProps) => kinds[kind]};
`

export const Alert: SFC<AlertProps> = ({ kind, ...props }) => (
  <AlertStyled {...props} kind={kind} />
)
