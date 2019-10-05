import React, { SFC } from 'react'

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

export const Alert: SFC<AlertProps> = ({ kind, ...props }) => (
  //@ts-ignore
  <div className="alert"> </div>
)
