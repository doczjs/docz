import { useThemeUI } from 'theme-ui';
import { get, defaultTo } from 'lodash';

export const themeProp = (str: string) => (props: any) => {
  return get(`theme.${str}`, props);
};

export const usePrismTheme = () => {
  //@ts-ignore
  const { theme, colorMode } = useThemeUI();
  const prismTheme = get(theme, 'prismTheme');

  const themeToUse = defaultTo(
    prismTheme,
    get(prismTheme, `prism.${colorMode}`, theme)
  );
  return themeToUse;
};
