import * as mixins from '~utils/mixins'

const border = {
  border: t => `1px solid ${t.colors.playground.border}`,
}

export const editor = theme => ({
  p: 2,
  border: t => `1px solid ${t.colors.border}`,
  background: theme.plain.backgroundColor,
  borderTop: 0,
  '.npm__react-simple-code-editor__textarea': {
    outline: 'none !important',
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
  position: 'absolute',
  bottom: -24,
  right: 3,
}

export const button = {
  ...mixins.ghostButton,
  py: 1,
  p: 2,
  bg: 'border',
  color: 'muted',
  borderRadius: '0 0 3px 3px',
  '& ~ &': {
    ml: 1,
  },
}
