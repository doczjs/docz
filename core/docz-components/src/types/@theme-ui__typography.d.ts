declare module '@theme-ui/typography' {
  import { Theme } from 'theme-ui';

  export function toTheme(_opts?: {}): Theme & {
    typography: {};
  };
}
