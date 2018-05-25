import * as colors from './colors'

export const styles = {
  inject: `
    @import url('https://fonts.googleapis.com/css?family=Inconsolata');
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700');
  `,
  body: {
    fontFamily: "'Source Sans Pro', Helvetica, sans-serif",
    fontSize: '16px',
    lineHeight: 1.5,
  },
  sidebar: {
    padding: 20,
    width: 320,
  },
  container: {
    padding: '50px 50px 100px',
    width: 960,
  },
  h1: {
    margin: '30px 0',
    fontSize: 48,
    fontWeight: 600,
  },
  h2: {
    margin: '50px 0 20px',
    fontSize: 32,
    fontWeight: 400,
  },
  h3: {
    margin: '30px 0 20px',
    fontSize: 24,
    fontWeight: 400,
  },
  h4: {
    fontSize: 20,
    fontWeight: 400,
  },
  h5: {
    fontSize: 18,
    fontWeight: 400,
  },
  h6: {
    fontSize: 16,
    fontWeight: 400,
  },
  list: {
    padding: 0,
    margin: '10px 0 10px 20px',
  },
  playground: {
    padding: '2rem',
  },
  pre: {
    fontFamily: "'Inconsolata', monospace",
    fontSize: 16,
  },
  table: {
    fontFamily: "'Inconsolata', monospace",
    fontSize: 16,
  },
  tooltip: {
    wrapper: {
      color: colors.primary,
    },
    content: {
      backgroundColor: colors.main,
      color: colors.grayLight,
    },
    tooltip: {
      display: 'flex',
      alignItems: 'center',
      width: 220,
      maxWidth: 220,
      padding: 5,
      backgroundColor: colors.main,
      borderRadius: '3px',
      fontSize: 16,
    },
    arrow: {
      borderTop: `solid ${colors.main} 5px`,
    },
  },
}
