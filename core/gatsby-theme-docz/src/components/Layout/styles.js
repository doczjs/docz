import { media } from '~theme/breakpoints'

export const main = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
}

export const wrapper = {
  py: 0,
  flex: 1,
  display: 'grid',
  gridTemplateColumns: '250px 1fr',
  [media.tablet]: {
    display: 'block',
  },
}

export const content = {
  backgroundColor: 'background',
  position: 'relative',
  maxWidth: 960,
  py: 5,
  px: 4,
  variant: 'styles.Container',
  [media.tablet]: {
    py: 4,
    px: 4,
    pt: 5,
  },
}
