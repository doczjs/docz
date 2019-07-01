import * as mixins from '~utils/mixins'

const border = {
  border: '1px solid black',
  borderColor: 'playground.border',
}

export const editor = showingCode => ({
  ...border,
  display: showingCode ? 'block' : 'none',
  m: 0,
  mt: '-1px',
  borderRadius: '0 0 5px 5px',
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
  right: 6,
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
