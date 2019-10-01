import { Theme } from 'theme-ui'

export const editor = {
  borderRadius: 'radius',
  border: (t: Theme) => `1px solid ${t.colors && t.colors.border}`,
  fontFamily: 'monospace',
}
