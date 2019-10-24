import * as mixins from '~utils/mixins'

export const editor = theme => ({
  p: 2,
  border: t => `1px solid ${t.colors.border}`,
  borderRadius: '0 0 4px 4px',
  background: theme.plain.backgroundColor,
  borderTop: 0,
  fontFamily: 'monospace',
  fontSize: 18,
  '* > textarea:focus': {
    outline: 'none',
  },
})

export const error = {
  m: 0,
  py: 2,
  px: 3,
  bg: '#FF4757',
  fontSize: 1,
  color: 'white',
}

export const previewWrapper = {
  position: 'relative',
}

export const previewInner = (showingCode, height = 'auto') => ({
  height,
  display: 'block',
  minHeight: '100%',
  width: 'calc(100% - 2px)',
  bg: 'playground.bg',
  border: t => `1px solid ${t.colors.playground.border}`,
  borderRadius: showingCode ? '4px 4px 0 0' : '4px',
})

export const preview = {
  m: 0,
  p: '20px',
}

export const buttons = {
  zIndex: 9,
  display: 'flex',
  position: 'absolute',
  bottom: -20,
  right: 4,
}

export const button = {
  ...mixins.ghostButton,
  display: 'flex',
  alignItems: 'center',
  py: 1,
  p: 2,
  bg: 'border',
  color: 'muted',
  borderRadius: '0 0 3px 3px',
  '& ~ &': {
    ml: 1,
  },
}

export const link = {
  py: 0,
  ml: 1,
  height: 22,
}
