import React, { SFC } from 'react'
import styled from 'styled-components'

export enum AlertKind {
  Info = 'info',
  Positive = 'positive',
  Negative = 'negative',
  Warning = 'warning',
}

export type KindMap = Record<AlertKind, string>

const kinds: KindMap = {
  [AlertKind.Info]: '#5352ED',
  [AlertKind.Positive]: '#2ED573',
  [AlertKind.Negative]: '#FF4757',
  [AlertKind.Warning]: '#FFA502',
}

export interface AlertProps {
  /**
   * Set this to change alert kind
   * @default info
   */
  kind: AlertKind
}

const AlertStyled = styled('div')`
  padding: 15px 20px;
  background: white;
  border-radius: 3px;
  color: white;
  background: ${({ kind = AlertKind.Info }: AlertProps) => kinds[kind]};
`

export const Alert: SFC<AlertProps> = ({ kind, ...props }) => (
  <AlertStyled {...props} kind={kind} />
)
