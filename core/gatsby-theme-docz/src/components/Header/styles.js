import * as mixins from '~utils/mixins'

export const wrapper = mode => ({
  backgroundSize: '400px auto',
  background:
    mode === 'dark'
      ? `url(https://cdn-std.dprcdn.net/files/acc_649651/ykOjN7)`
      : `url(https://cdn-std.dprcdn.net/files/acc_649651/zPkIFZ)`,
})

export const innerContainer = {
  ...mixins.centerAlign,
  p: 4,
  position: 'relative',
  justifyContent: 'space-between',
}

export const headerButton = {
  ...mixins.centerAlign,
  outline: 'none',
  p: '12px',
  border: 'none',
  borderRadius: 9999,
  bg: 'header.button.bg',
  color: 'header.button.color',
  fontSize: 0,
  fontWeight: 600,
  ':hover': {
    cursor: 'pointer',
  },
}

export const editButton = {
  ...mixins.centerAlign,
  position: 'absolute',
  bottom: -40,
  right: 30,
  bg: 'transparent',
  color: 'muted',
  fontSize: 1,
  textDecoration: 'none',
  borderRadius: 'radius',
}
