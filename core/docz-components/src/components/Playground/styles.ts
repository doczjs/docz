import get from 'lodash/get';

import * as mixins from '../../utils/mixins';
import { Theme } from '../../types';
import { PrismTheme } from 'prism-react-renderer';
import { SxStyleProp } from 'theme-ui';

export const editor = (theme: PrismTheme) =>
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
  } as SxStyleProp);

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
