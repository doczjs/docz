import get from 'lodash/get';

import { Theme } from '../../types';
import * as mixins from '../../utils/mixins';

export const editor = (theme: Theme) =>
  ({
    p: 2,
    border: (t: Theme) => `1px solid ${get(t, 'colors.border', 'transparent')}`,
    borderRadius: '0 0 4px 4px',
    background: get(theme, 'plain.backgroundColor', 'none'),
    borderTop: 0,
    fontFamily: 'monospace',
    fontSize: 18,
    '* > textarea:focus': {
      font: '400 18px Inconsolata',
      lineHeight: '1.5em ',
      outline: 'none',
    },
  } as any);

export const error = {
  m: 0,
  py: 2,
  px: 3,
  bg: '#FF4757',
  fontSize: 1,
  color: 'white',
};

export const previewWrapper = {
  position: 'relative',
};

export const preview = {
  m: 0,
  p: '20px',
  bg: 'playground.bg',
};

export const buttons = {
  zIndex: 9,
  display: 'flex',
  position: 'absolute',
  bottom: -20,
  right: 4,
};

export const button = {
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

export const link = {
  py: 0,
  ml: 1,
  height: 22,
};
