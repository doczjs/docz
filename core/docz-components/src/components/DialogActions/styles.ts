import * as mixins from '../../utils/mixins';

export const buttons = {
  display: 'flex',
  margin: 2,
  borderRadius: 2,
};

export const actionButton = {
  ...mixins.ghostButton,
  display: 'flex',
  alignItems: 'center',
  py: 1,
  p: 2,
  bg: 'border',
  color: 'muted',
  borderRadius: '0 0 3px 3px',
  '& ~ &': {
    ml: 1,
  },
};
