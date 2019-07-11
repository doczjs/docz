import * as mixins from '~utils/mixins'
import { isAbsolute } from 'upath'

const border = {
  border: t => `1px solid ${t.colors.playground.border}`,
}

export const editor = theme => ({
  p: 2,
  border: t => `1px solid ${t.colors.border}`,
  background: theme.plain.backgroundColor,
  borderTop: 0,
  fontFamily: 'monospace',
  fontSize: 18,
  '* > textarea:focus': {
    font: '400 18px Inconsolata !important',
    lineHeight: '1.5em !important',
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

export const preview = showingCode => ({
  ...border,
  m: 0,
  p: 4,
  bg: 'playground.bg',
  borderRadius: showingCode ? '5px 5px 0 0' : '5px',
})

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
