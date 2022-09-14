import "@testing-library/jest-dom";
import type { RenderOptions } from "@testing-library/react";
import { render as rtlRender } from "@testing-library/react";

import { userEvent } from "./user-event";

export function render(
  ui: React.ReactElement,
  options: RenderOptions = {}
): ReturnType<typeof rtlRender> & { user: ReturnType<typeof userEvent.setup> } {
  const user = userEvent.setup();
  const result = rtlRender(ui, options);
  return { user, ...result };
}
