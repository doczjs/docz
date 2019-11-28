const styles = {
  Container: {
    p: 4,
    maxWidth: 1280,
  },
  root: {
    fontSize: 3,
    color: 'text',
    bg: 'background',
  },
  a: {
    color: 'primary',
    textDecoration: 'none',
    '&:hover': {
      color: 'secondary',
      textDecoration: 'underline',
    },
  },
  h1: {
    fontSize: 6,
  },
  h2: {
    fontSize: 5,
  },
  h3: {
    fontSize: 4,
  },
  h4: {
    fontSize: 3,
  },
  h5: {
    fontSize: 2,
  },
  h6: {
    fontSize: 1,
  },
  li: {
    marginBottom: 1,
  },
  blockquote: {
    my: 4,
    mx: 0,
    py: 3,
    px: 4,
    bg: 'blockquote.bg',
    borderLeft: t => `5px solid ${t.colors.blockquote.border}`,
    color: 'blockquote.color',
    fontStyle: 'italic',
    '> p': {
      m: 0,
    },
  },
  code: {
    fontFamily: 'monospace',
  },
  inlineCode: {
    fontFamily: 'monospace',
  },
  pre: {
    my: 4,
    p: 3,
    variant: 'prism',
    textAlign: 'left',
    fontFamily: 'monospace',
    borderRadius: 'radius',
  },
  table: {
    width: '100%',
    my: 4,
    borderCollapse: 'separate',
    borderSpacing: 0,
    [['th', 'td']]: {
      textAlign: 'left',
      py: '4px',
      pr: '4px',
      pl: 0,
      borderColor: 'muted',
      borderBottomStyle: 'solid',
    },
  },
  th: {
    verticalAlign: 'bottom',
    borderBottomWidth: '2px',
  },
  td: {
    verticalAlign: 'top',
    borderBottomWidth: '1px',
  },
  hr: {
    border: 0,
    borderBottom: t => `1px solid ${t.colors.border}`,
  },
}

export default styles
