import { media } from '~theme/breakpoints'

export const global = {
  body: {
    overflow: 'hidden',
  },
}

const HEADER_HEIGHT = 81

export const overlay = ({ open }) => ({
  zIndex: 999,
  position: 'fixed',
  top: HEADER_HEIGHT,
  right: 0,
  bottom: 0,
  left: 0,
  background: 'rgba(0,0,0,0.6)',
  transition: 'all .2s ease-out',
  visibility: open ? 'visible' : 'hidden',
  opacity: open ? 1 : 0,
})

export const wrapper = ({ open }) => ({
  py: 4,
  px: 4,
  flexDirection: 'column',
  position: 'sticky',
  top: 0,
  zIndex: 1,
  minWidth: 0,
  maxHeight: '100vh',
  borderRight: t => `1px solid ${t.colors.border}`,
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch',
  bg: 'sidebar.bg',

  [media.tablet]: {
    zIndex: 9999,
    display: 'block',
    position: 'fixed',
    top: HEADER_HEIGHT,
    left: 0,
    bottom: 0,
    width: 256,
    px: 4,
    bg: 'background',
    transition: 'transform .2s ease-out',
    transform: open ? 'translateX(0)' : 'translateX(-100%)',
  },
})
