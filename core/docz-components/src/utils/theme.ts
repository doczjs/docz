import { useThemeUI } from 'theme-ui';
import { get, defaultTo } from 'lodash';
import getTheme from '../theme/';

export const themeProp = (str: string) => (props: any) => {
  return get(`theme.${str}`, props);
};

export const usePrismTheme = () => {
  //@ts-ignore
  const { theme, colorMode = 'light' } = useThemeUI();
  const prismTheme = get(theme, 'prismTheme');
  const themeToUse = defaultTo(
    prismTheme,
    get(theme, `prism.${colorMode}`, get(getTheme(), `prism.${colorMode}`))
  );
  return themeToUse;
};
