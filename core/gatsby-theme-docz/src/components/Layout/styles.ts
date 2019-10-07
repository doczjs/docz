import { media } from 'docz-components'

export const main = {
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
}

export const wrapper = {
  py: 0,
  flex: 1,
  display: 'grid',
  gridTemplateRows: '100%',
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
