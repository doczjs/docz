import { PrismTheme } from 'prism-react-renderer';
import { Theme as ThemeUI } from 'theme-ui';

export interface Theme extends ThemeUI {
  prism?: {
    [key: string]: PrismTheme;
  };
}
