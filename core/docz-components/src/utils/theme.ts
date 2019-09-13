import { useThemeUI } from 'theme-ui';
import { get, defaultTo } from 'lodash';
import getTheme from '../theme/';
import { PrismTheme } from 'prism-react-renderer';

export const themeProp = (str: string) => (props: any) => {
  return get(`theme.${str}`, props);
};

export const usePrismTheme = () => {
  const themeUI = useThemeUI();
  const prismTheme = get(themeUI.theme, 'prismTheme');
  const colorMode: string = get(themeUI, 'colorMode', 'light');
  const themeToUse = defaultTo<PrismTheme>(
    prismTheme,
    get(
      themeUI.theme,
      `prism.${colorMode}`,
      get(getTheme(), `prism.${colorMode}`)
    )
  );

  return themeToUse;
};
