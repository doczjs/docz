import type { RenderOptions } from '@testing-library/react';
import type { JestAxeConfigureOptions } from 'jest-axe';
import { axe, toHaveNoViolations } from 'jest-axe';
import { isValidElement } from 'react';

import { render } from './render';

export async function testA11y(
  ui: React.ReactElement | HTMLElement,
  options: RenderOptions & { axeOptions?: JestAxeConfigureOptions } = {}
) {
  const { axeOptions, ...rest } = options;
  const container = isValidElement(ui) ? render(ui, rest).container : ui;
  const results = await axe(container, axeOptions);
  expect(results).toHaveNoViolations();
}

expect.extend(toHaveNoViolations);
