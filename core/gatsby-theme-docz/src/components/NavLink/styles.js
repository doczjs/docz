export const link = {
  my: 2,
  display: 'block',
  color: 'sidebar.navLink',
  textDecoration: 'none',
  fontSize: 2,
  '&.active': {
    color: 'sidebar.navLinkActive',
  },
}

export const smallLink = {
  ...link,
  ml: 2,
  fontSize: 1,
  color: 'sidebar.tocLink',
  '&.active': {
    color: 'sidebar.tocLinkActive',
  },
}
