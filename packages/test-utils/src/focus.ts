import { act } from '@testing-library/react';

import { getActiveElement } from './utils/dom';
import { isFocusable } from './utils/tabbable';

export function focus(el: HTMLElement) {
  if (getActiveElement(el) === el) return;
  if (!isFocusable(el)) return;
  act(() => {
    el.focus();
  });
}

export function blur(el?: HTMLElement | null) {
  // eslint-disable-next-line no-param-reassign
  if (el == null) el = document.activeElement as HTMLElement;
  if (el.tagName === 'BODY') return;
  if (getActiveElement(el) !== el) return;
  act(() => {
    if (el && 'blur' in el) el.blur();
  });
}
