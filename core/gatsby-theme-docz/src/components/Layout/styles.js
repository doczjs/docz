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
  gridTemplateColumns: '250px minmax(0, 1fr)',
  minHeight: '100vh',
  [media.tablet]: {
    display: 'block',
  },
}
