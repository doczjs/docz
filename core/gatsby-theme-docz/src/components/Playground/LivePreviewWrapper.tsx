/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from 'react'

const styles = {
  iframe: (showingCode: boolean, height = 'auto') => ({
    height,
    display: 'block',
    minHeight: '100%',
    width: 'calc(100% - 2px)',
    border: (t: any) => `1px solid ${t.colors.playground.border}`,
    borderRadius: showingCode ? '4px 4px 0 0' : '4px',
  }),
}

export interface LivePreviewWrapperProps {
  showingCode: boolean
}

export const LivePreviewWrapper: React.FunctionComponent<
  LivePreviewWrapperProps
> = ({ children, showingCode }) => {
  return <div sx={styles.iframe(showingCode)}>{children}</div>
}
