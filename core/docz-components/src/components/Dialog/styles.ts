export const overlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

export const content = (width: string, height: string) => ({
  position: 'relative',
  width,
  height,
  backgroundColor: '#fff',
  padding: '1rem',
  borderRadius: '0.25rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-around',
});

export const close = {
  position: 'absolute',
  top: 2,
  right: 2,
  zIndex: 999,
  backgroundColor: 'background',
  borderRadius: 2,
  height: 20,
  width: 20,
  padding: 0,
  margin: 0,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#f3f3f3',
  },
};
