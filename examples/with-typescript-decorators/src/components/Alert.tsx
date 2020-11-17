/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC } from 'react'

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

export const Alert: FC<AlertProps> = ({ children, kind, ...rest }) => (
  <div
    style={{
      padding: 20,
      background: kinds[kind] || 'white',
      borderRadius: 3,
      color: 'white',
    }}
    {...rest}
  >
    {children}
  </div>
)
